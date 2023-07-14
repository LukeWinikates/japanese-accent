package dictionary

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/dictionary"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func MakeDictionaryWordGet(dictionaryDB *gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		searchTerm := context.Param("searchTerm")
		var words []dictionary.Word
		dictionaryDB.Find(&words, searchTerm)
		context.JSON(200, words)
	}
}
