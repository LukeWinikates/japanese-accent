package server

import (
	"fmt"
	"github.com/LukeWinikates/japanese-accent/internal/app/core"
	"github.com/LukeWinikates/japanese-accent/internal/app/parser"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"log"
	"strings"
)

//type Category struct {
//	Name       string     `json:"name"`
//	Categories []Category `json:"categories"`
//}

func MakeHandleCategoriesGET(wordsFilePath string) func(ctx *gin.Context) {

	return func(context *gin.Context) {

		content, err := ioutil.ReadFile(wordsFilePath)
		if err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		wordlist, err := parser.Parse(string(content))

		if err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		//categories := []Category{
		//	{
		//		Name: "五味太郎",
		//		Categories: []Category{{
		//			Name:       "とうさん　まいご",
		//			Categories: []Category{},
		//		}},
		//	},
		//	{
		//		Name: "Japanese Phonetics with Dogen",
		//		Categories: []Category{{
		//			Name:       "Ep 8",
		//			Categories: []Category{},
		//		}, {
		//			Name:       "Ep 12",
		//			Categories: []Category{},
		//		}, {
		//			Name:       "Ep 14",
		//			Categories: []Category{},
		//		}},
		//	},
		//}
		context.JSON(200, wordlist.Categories)
	}
}

type ApiLink struct {
}

type ApiWord struct {
	Text       string   `json:"word"`
	Furigana   string   `json:"furigana"`
	AccentMora *int     `json:"accentMora"`
	MoraCount  int      `json:"moraCount"`
	Shiki      string   `json:"shiki"`
	Morae      []string `json:"morae"`
	Link       string   `json:"link"`
}

func makeApiWord(word core.Word) ApiWord {
	fmt.Printf("%s: %v\n", word.Text, word.MoraCount())
	fmt.Printf("%s: %s\n", word.Text, word.Morae())
	return ApiWord{
		Text:       word.Text,
		Furigana:   word.Furigana,
		AccentMora: word.AccentMora,
		MoraCount:  word.MoraCount(),
		Morae:      word.Morae(),
		Link:       word.ForvoURL(),
		Shiki:      string(word.Shiki()),
	}
}

type ApiCategory struct {
	Name            string `json:"name"`
	Tag             string
	Notes           string
	Links           []ApiLink
	Words           []ApiWord `json:"words"`
	SuzukiKunAction string    `json:"suzukiKunAction"`
}

func MakeHandleCategoryGET(wordsFilePath string) gin.HandlerFunc {
	return func(context *gin.Context) {

		content, err := ioutil.ReadFile(wordsFilePath)
		if err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		wordlist, err := parser.Parse(string(content))

		if err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		categoryParam := strings.ReplaceAll(context.Params.ByName("category"), "/", "")
		log.Printf("name: %s\n", categoryParam)

		for _, category := range wordlist.Categories {
			if strings.ReplaceAll(category.Name, "#", "") == categoryParam {
				categoryJSON := ApiCategory{
					Name:            category.Name,
					Words:           apiWords(category.Words),
					SuzukiKunAction: suzukiKunAction(category.Words),
				}
				context.JSON(200, categoryJSON)
				return
			}
		}

		context.Status(404)
	}

}

func suzukiKunAction(words []core.Word) string {
	str := "http://www.gavo.t.u-tokyo.ac.jp/ojad/phrasing/index"
	//params := "_method=POST&data%5BPhrasing%5D%5Btext%5D=%E9%87%91%E9%AD%9A&data%5BPhrasing%5D%5Bcurve%5D=advanced&data%5BPhrasing%5D%5Baccent%5D=advanced&data%5BPhrasing%5D%5Baccent_mark%5D=all&data%5BPhrasing%5D%5Bestimation%5D=crf&data%5BPhrasing%5D%5Banalyze%5D=true&data%5BPhrasing%5D%5Bphrase_component%5D=invisible&data%5BPhrasing%5D%5Bparam%5D=invisible&data%5BPhrasing%5D%5Bsubscript%5D=visible&data%5BPhrasing%5D%5Bjeita%5D=invisible"
	return str
}

func apiWords(words []core.Word) []ApiWord {
	apiWords := make([]ApiWord, 0)
	for _, w := range words {
		apiWords = append(apiWords, makeApiWord(w))
	}
	return apiWords
}
