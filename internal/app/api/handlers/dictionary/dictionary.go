package dictionary

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/dictionary"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
)

func MakeDictionaryWordGet(dictionaryDB *gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		searchTerm := context.Param("searchTerm")
		words := dictionary.LookForWord(dictionaryDB, searchTerm)
		log.Printf("%v\n", words)
		context.JSON(200, words)
	}
}
