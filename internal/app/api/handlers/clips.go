package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"log"
)

func MakeAudioClipsPUT(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		clipID := context.Param("id")
		var request types.ClipEditRequest
		if err := context.BindJSON(&request); err != nil {
			context.Status(500)
			return
		}

		var clip *database.Clip
		if err := db.Where("uuid = ? ", clipID).Find(&clip).Error; err != nil {
			context.Status(404)
			log.Println(err.Error())
			return
		}

		clip.StartMS = request.StartMS
		clip.Text = request.Text
		clip.EndMS = request.EndMS

		if err := db.Save(clip).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
		}
	}
}

func MakeAudioClipsCREATE(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var createRequest types.ClipCreateRequest
		if err := context.BindJSON(&createRequest); err != nil {
			context.Status(500)
			return
		}
		var video *database.Video

		if err := db.Where("youtube_id = ? ", createRequest.VideoID).Find(&video).Error; err != nil {
			context.Status(404)
			log.Println(err.Error())
			return
		}

		var clip = database.Clip{
			UUID:    uuid.NewString(),
			StartMS: createRequest.StartMS,
			Text:    createRequest.Text,
			EndMS:   createRequest.EndMS,
		}

		if err := db.Model(&video).Association("Clips").Append(&clip); err != nil {
			context.Status(500)
			log.Println(err.Error())
			return
		}

		context.JSON(201, types.Clip{
			UUID:      clip.UUID,
			StartMS:   clip.StartMS,
			EndMS:     clip.EndMS,
			Text:      clip.Text,
			VideoUUID: video.YoutubeID,
		})
	}
}

func MakeAudioClipsDELETE(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		clipID := context.Param("id")

		var clip *database.Clip
		if err := db.Where("uuid = ? ", clipID).Find(&clip).Error; err != nil {
			log.Println(err.Error())
			context.Status(404)
			return
		}

		if err := db.Delete(clip).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		context.Status(204)
	}
}
