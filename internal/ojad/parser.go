package ojad

import (
	"github.com/andybalholm/cascadia"
	"golang.org/x/net/html"
	"io"
)

type HighLow = string

type PitchedMora struct {
	Mora string
	HighLow
}

type Pitch struct {
	Morae []PitchedMora
}

func Parse(resp io.Reader) ([]Pitch, error) {
	decoder, err := html.Parse(resp)

	if err != nil {
		return nil, err
	}
	pitches := make([]Pitch, 0)

	nodes := cascadia.QueryAll(decoder, cascadia.MustCompile(".phrasing_text"))

	for _, phraseNode := range nodes {
		spans := cascadia.QueryAll(phraseNode, cascadia.MustCompile("[class *= mola]"))
		morae := make([]PitchedMora, 0)
		for _, span := range spans {
			highlow := "low"
			if cascadia.MustCompile(".accent_top").Match(span) {
				highlow = "kernel"
			}
			if cascadia.MustCompile(".accent_plain").Match(span) {
				highlow = "high"
			}
			morae = append(morae, PitchedMora{
				Mora:    parseChars(span),
				HighLow: highlow,
			})
		}
		pitches = append(pitches, Pitch{
			Morae: morae,
		})
	}

	return pitches, nil
}

func parseChars(span *html.Node) string {
	moraString := ""
	for _, node := range cascadia.QueryAll(span, cascadia.MustCompile(".char")) {
		moraString = moraString + node.FirstChild.Data
	}
	return moraString
}
