package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
)

func MakeVideoWordLinkCREATE(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var wordLinkCreateRequest types.VideoWordLinkCreateRequest

		if err := context.BindJSON(&wordLinkCreateRequest); err != nil {
			context.Status(500)
			return
		}

		var word database.Word
		var video database.Video

		if err := db.FirstOrCreate(&word, database.Word{
			DisplayText: wordLinkCreateRequest.Word,
		}).Error; err != nil {
			context.Status(500)
			log.Println(err.Error())
			return
		}

		if err := db.
			Where("youtube_id", wordLinkCreateRequest.VideoID).
			First(&video).Error; err != nil {
			log.Println(err.Error())
			context.Status(404)
			return
		}

		if err := db.Model(&video).Association("Words").
			Append(&word); err != nil {
			log.Printf("failed to save association due to error: %s \n", err.Error())
			context.Status(500)
			return
		}

		context.Status(201)
	}
}
