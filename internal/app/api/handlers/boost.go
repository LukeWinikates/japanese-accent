package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
	"time"
)

func MakeBoostPOST(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var boostRequest types.BoostCreateRequest
		if err := context.BindJSON(&boostRequest); err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		var segment *database.VideoSegment
		if err := db.Where("uuid = ? ", boostRequest.SegmentID).Find(&segment).Error; err != nil {
			context.Status(404)
			log.Println(err.Error())
			return
		}

		boost := database.SegmentBoost{
			Segment:   *segment,
			BoostedAt: time.Now(),
		}

		if err := db.Save(&boost).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		segment.Priority = segment.Priority + database.BoostPriority

		db.Save(&segment)

		context.Status(200)
	}
}
