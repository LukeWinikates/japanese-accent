package server

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/parser"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"log"
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
