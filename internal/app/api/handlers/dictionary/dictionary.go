package dictionary

import (
	"github.com/blevesearch/bleve/v2"
	"github.com/gin-gonic/gin"
)

func MakeDictionaryWordGet(index bleve.Index) gin.HandlerFunc {
	return func(context *gin.Context) {
		searchTerm := context.Param("searchTerm")

		query := bleve.NewQueryStringQuery(searchTerm)
		searchRequest := bleve.NewSearchRequest(query)
		searchResult, err := index.Search(searchRequest)
		if err != nil {
			context.Status(500)
		}

		context.JSON(200, searchResult)
	}
}
