package forvo

import (
	"encoding/json"
	"fmt"
	"net/http"
	url2 "net/url"
)

const urlFormat = "https://apifree.forvo.com/action/word-pronunciations/format/json/word/%s/id_lang_speak/76/key/%s/"

type Client struct {
	key string
}

func MakeClient(key string) Client {
	return Client{key: key}
}

//goland:noinspection SpellCheckingInspection
type Pronunciation struct {
	Id               int    `json:"id"`
	Word             string `json:"word"`
	Original         string `json:"original"`
	AddTime          string `json:"addtime"`
	Hits             int    `json:"hits"`
	Username         string `json:"username"`
	Sex              string `json:"sex"`
	Country          string `json:"country"`
	Code             string `json:"code"`
	LangName         string `json:"langname"`
	PathMP3          string `json:"pathmp3"`
	PathOgg          string `json:"pathogg"`
	Rate             int    `json:"rate"`
	NumVotes         int    `json:"num_votes"`
	NumPositiveVotes int    `json:"num_positive_votes"`
}

type PronunciationList struct {
	Items []Pronunciation `json:"items"`
}

func (client Client) GetPronunciations(word string) ([]Pronunciation, error) {
	var pronunciations PronunciationList
	url := client.wordUrl(word)
	fmt.Println(url)
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

func (client Client) wordUrl(word string) string {
	return fmt.Sprintf(urlFormat,
		url2.QueryEscape(word),
		client.key)
}
