package server

import (
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

type ApiCategory struct {
	Name  string `json:"name"`
	Tag   string
	Notes string
	Links []ApiLink
	Words []core.Word `json:"words"`
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
					Words: category.Words,
				}
				context.JSON(200, categoryJSON)
				return
			}
		}

		context.Status(404)
	}

}
