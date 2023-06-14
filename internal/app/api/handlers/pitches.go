package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/ojad"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
)

func MakeClipPitchesCREATE(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		segmentID := context.Param("id")

		var segment *database.VideoSegment
		if err := db.Where("uuid = ? ", segmentID).Find(&segment).Error; err != nil {

			log.Println(err.Error())
			context.Status(404)
			return
		}
		//
		//if db.Where("ClipID = ?", segmentID).Find(&database.SegmentPitch{}).Error != nil {
		//	log.Println("already has a pitch")
		//
		//}

		pitches, err := ojad.GetPitches(segment.Text)

		if err != nil {
			log.Println(err.Error())
			context.Status(500)
		}

		normalized := ojad.MakePitchAndMoraStrings(pitches)

		dbPitch := database.SegmentPitch{
			Morae:   normalized.Morae,
			Pattern: normalized.Pitch,
			Source:  "OJAD",
		}
		if err := db.Model(&segment).Association("SegmentPitch").Replace(&dbPitch); err != nil {

			log.Println(err.Error())
			context.Status(500)
			return
		}

		context.JSON(201, makeApiPitch(dbPitch))
	}
}

func makeApiPitch(pitch database.SegmentPitch) types.VideoSegmentPitch {
	return types.VideoSegmentPitch{
		Pattern: pitch.Pattern,
		Morae:   pitch.Morae,
	}
}
