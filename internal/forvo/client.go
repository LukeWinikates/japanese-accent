package forvo

import (
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
	GetPronunciations(word string) ([]Pronunciation, error)
}

//goland:noinspection SpellCheckingInspection

func (client BaseClient) GetPronunciations(word string) ([]Pronunciation, error) {
	var pronunciations PronunciationList
	url := client.wordUrl(word)
	resp, err := http.Get(url)

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

func (client BaseClient) wordUrl(word string) string {
	return fmt.Sprintf(urlFormat,
		url2.QueryEscape(word),
		client.key)
}
