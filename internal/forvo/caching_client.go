package forvo

import (
	"context"
	"time"

	"github.com/eko/gocache/lib/v4/cache"
	store "github.com/eko/gocache/store/go_cache/v4"
	gocache "github.com/patrickmn/go-cache"
)

type cachingClient struct {
	cache *cache.LoadableCache[[]Pronunciation]
}

func (c cachingClient) GetPronunciations(context context.Context, word string) ([]Pronunciation, error) {
	cacheResult, err := c.cache.Get(context, word)
	if err != nil {
		return nil, err
	}
	return cacheResult, nil
}

func MakeCachingClient(key string) Client {
	return cachingClient{cache: makeCache(MakeClient(key))}
}

func makeCache(client BaseClient) *cache.LoadableCache[[]Pronunciation] {
	gocacheClient := gocache.New(time.Minute*15, time.Minute)
	gocacheStore := store.NewGoCache(gocacheClient)

	loadFunction := func(ctx context.Context, key any) ([]Pronunciation, error) {
		return client.GetPronunciations(ctx, key.(string))
	}

	return cache.NewLoadable[[]Pronunciation](loadFunction, cache.New[[]Pronunciation](gocacheStore))
}
