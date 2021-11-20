package forvo

import (
	"github.com/eko/gocache/cache"
	"github.com/eko/gocache/store"
	gocache "github.com/patrickmn/go-cache"
	"time"
)

type cachingClient struct {
	cache *cache.LoadableCache
}

func (c cachingClient) GetPronunciations(word string) ([]Pronunciation, error) {
	cacheResult, err := c.cache.Get(word)
	if err != nil {
		return nil, err
	}
	return cacheResult.([]Pronunciation), nil
}

func MakeCachingClient(key string) Client {
	return cachingClient{cache: makeCache(MakeClient(key))}
}

func makeCache(client BaseClient) *cache.LoadableCache {
	gocacheClient := gocache.New(time.Minute*15, time.Minute)
	gocacheStore := store.NewGoCache(gocacheClient, nil)
	loadFunction := func(key interface{}) (interface{}, error) {
		return client.GetPronunciations(key.(string))
	}

	return cache.NewLoadable(loadFunction, gocacheStore)
}

