package server

import (
	"github.com/gin-gonic/gin"
)

type Category struct {
	Name       string     `json:"name"`
	Categories []Category `json:"categories"`
}

func HandleCategoriesGET(context *gin.Context) {
	categories := []Category{
		{
			Name: "五味太郎",
			Categories: []Category{{
				Name:       "とうさん　まいご",
				Categories: []Category{},
			}},
		},
		{
			Name: "Japanese Phonetics with Dogen",
			Categories: []Category{{
				Name:       "Ep 8",
				Categories: []Category{},
			}, {
				Name:       "Ep 12",
				Categories: []Category{},
			}, {
				Name:       "Ep 14",
				Categories: []Category{},
			}},
		},
	}
	context.JSON(200, categories)
}
