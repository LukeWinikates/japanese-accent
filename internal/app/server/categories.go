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

		context.JSON(200, CategoriesListResponse{
			Categories: wordlist.Categories,
			Media:      MapApiLinks(wordlist.Media),
		})
	}
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
					Name:  category.Name,
					Words: apiWords(category.Words),
				}
				context.JSON(200, categoryJSON)
				return
			}
		}

		context.Status(404)
	}
}

func MapApiLinks(links []parser.Link) []ApiVideo {
	apiLinks := make([]ApiVideo, 0)
	for _, link := range links {
		apiLinks = append(apiLinks, ApiVideo{
			Title:   link.Text,
			URL:     link.URL,
			VideoID: link.VideoID(),
		})
	}
	return apiLinks
}

func apiWords(words []core.Word) []ApiWord {
	apiWords := make([]ApiWord, 0)
	for _, w := range words {
		apiWords = append(apiWords, makeApiWord(w))
	}
	return apiWords
}
