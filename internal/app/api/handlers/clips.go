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
		segmentID := context.Param("id")
		var segmentEditRequest types.SegmentEditRequest
		if err := context.BindJSON(&segmentEditRequest); err != nil {
			context.Status(500)
			return
		}

		log.Print(segmentEditRequest)

		var segment *database.VideoSegment
		if err := db.Where("uuid = ? ", segmentID).Find(&segment).Error; err != nil {
			context.Status(404)
			log.Println(err.Error())
			return
		}

		segment.StartMS = segmentEditRequest.StartMS
		segment.Text = segmentEditRequest.Text
		segment.EndMS = segmentEditRequest.EndMS

		if err := db.Save(segment).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
		}
	}
}

func MakeAudioClipsCREATE(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var createRequest types.SegmentCreateRequest
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

		var segment = database.VideoSegment{
			UUID:    uuid.NewString(),
			StartMS: createRequest.StartMS,
			Text:    createRequest.Text,
			EndMS:   createRequest.EndMS,
		}

		if err := db.Model(&video).Association("Segments").Append(&segment); err != nil {
			context.Status(500)
			log.Println(err.Error())
			return
		}

		context.JSON(201, types.VideoSegment{
			UUID:      segment.UUID,
			StartMS:   segment.StartMS,
			EndMS:     segment.EndMS,
			Text:      segment.Text,
			VideoUUID: video.YoutubeID,
		})
	}
}

func MakeAudioClipsDELETE(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		segmentID := context.Param("id")

		var segment *database.VideoSegment
		if err := db.Where("uuid = ? ", segmentID).Find(&segment).Error; err != nil {
			log.Println(err.Error())
			context.Status(404)
			return
		}

		if err := db.Delete(segment).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		context.Status(204)
	}
}