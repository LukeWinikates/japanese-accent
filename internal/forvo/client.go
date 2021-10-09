package forvo

import (
	"encoding/json"
	"fmt"
	"golang.org/x/net/idna"
	"net/http"
)

type Client struct {
	key string
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
	ascii, err := idna.ToASCII(word)
	if err != nil {
		return nil, err
	}

	resp, err := http.Get(client.wordUrl(ascii))

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

func (client Client) wordUrl(ascii string) string {
	return fmt.Sprintf("https://apifree.forvo.com/action/word-pronunciations/format/json/word/%s/id_lang_speak/76/key/%s/", ascii, client.key)
}
