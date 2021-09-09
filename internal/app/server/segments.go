package server

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/core"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"log"
)

func MakeAudioSegmentsPOST(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		segmentID := context.Param("id")
		var segmentEditRequest SegmentEditRequest
		if err := context.BindJSON(&segmentEditRequest); err != nil {
			context.Status(500)
		}

		log.Print(segmentEditRequest)

		var segment *core.VideoSegment
		if err := db.Where("uuid = ? ", segmentID).Find(&segment).Error; err != nil {
			context.Status(404)
			log.Println(err.Error())
		}

		segment.Start = segmentEditRequest.Start
		segment.Text = segmentEditRequest.Text
		segment.End = segmentEditRequest.End

		db.Save(segment)
	}
}
func MakeAudioSegmentsCREATE(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var createRequest SegmentCreateRequest
		if err := context.BindJSON(&createRequest); err != nil {
			context.Status(500)
		}
		var video *core.Video

		if err := db.Where("youtube_id = ? ", createRequest.VideoID).Find(&video).Error; err != nil {
			context.Status(404)
			log.Println(err.Error())
			return
		}
		log.Print(createRequest)

		var segment = core.VideoSegment{
			UUID:  uuid.NewString(),
			Start: createRequest.Start,
			Text:  createRequest.Text,
			End:   createRequest.End,
		}

		if err := db.Model(video).Association("Segments").Append(&segment); err != nil {
			context.Status(500)
			log.Println(err.Error())
			return
		}

		context.JSON(201, ApiVideoSegment{
			UUID:  segment.UUID,
			Start: segment.Start,
			End:   segment.End,
			Text:  segment.Text,
		})
	}
}

func MakeAudioSegmentsDELETE(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		segmentID := context.Param("id")

		var segment *core.VideoSegment
		//
		if err := db.Where("uuid = ? ", segmentID).Find(&segment).Error; err != nil {

			log.Println(err.Error())
			context.Status(404)
			return
		}

		//db.Delete(segment)

		if err := db.Delete(segment).Error; err != nil {

			log.Println(err.Error())
			context.Status(500)
			return
		}

		context.Status(204)
	}
}
