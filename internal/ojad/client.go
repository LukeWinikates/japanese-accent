package ojad

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
)

var defaults = map[string]string{
	"curve":            "advanced",
	"accent":           "advanced",
	"accent_mark":      "all",
	"estimation":       "crf",
	"analyze":          "true",
	"phrase_component": "invisible",
	"param":            "invisible",
	"subscript":        "visible",
	"jeita":            "invisible",
}

func GetPitches(phrase string) ([]Pitch, error) {
	client := &http.Client{}

	//Not working, the post data is not a form

	values := url.Values{
		"data[Phrasing][text]": {phrase},
	}

	for k, value := range defaults {
		key := fmt.Sprintf("data[Phrasing][%s]", k)
		values.Add(key, value)
	}

	req, err := http.NewRequest("POST",
		"http://www.gavo.t.u-tokyo.ac.jp/ojad/phrasing/index",
		strings.NewReader(values.Encode()))
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	defer resp.Body.Close()
	parseResult, err := Parse(resp.Body)
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	return normalize(parseResult), nil
}

func normalize(parseResult []Pitch) []Pitch {
	normalized := make([]PitchedMora, 0)
	for _, pitch := range parseResult {
		normalized = append(normalized, pitch.Morae...)
	}
	return []Pitch{
		{Morae: normalized},
	}
}
