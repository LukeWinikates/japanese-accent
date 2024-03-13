package forvo

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	url2 "net/url"
)

type BaseClient struct {
	key string
}

func MakeClient(key string) BaseClient {
	return BaseClient{key: key}
}

type Client interface {
	GetPronunciations(context context.Context, word string) ([]Pronunciation, error)
}

func (client BaseClient) GetPronunciations(context context.Context, word string) ([]Pronunciation, error) {
	var pronunciations PronunciationList
	url := client.wordURL(word)
	resp, err := http.NewRequestWithContext(context, "GET", url, nil)

	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	decoder := json.NewDecoder(resp.Body)

	err = decoder.Decode(&pronunciations)
	if err != nil {
		return nil, err
	}

	return pronunciations.Items, err
}

func (client BaseClient) wordURL(word string) string {
	return fmt.Sprintf(urlFormat,
		url2.QueryEscape(word),
		client.key)
}
