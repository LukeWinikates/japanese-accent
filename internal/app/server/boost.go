package server

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/core"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
	"time"
)

func MakeBoostPOST(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var boostRequest BoostCreateRequest
		if err := context.BindJSON(&boostRequest); err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		var segment *core.VideoSegment
		if err := db.Where("uuid = ? ", boostRequest.SegmentID).Find(&segment).Error; err != nil {
			context.Status(404)
			log.Println(err.Error())
			return
		}

		boost := core.SegmentBoost{
			Segment:   *segment,
			BoostedAt: time.Now(),
		}

		if err := db.Save(&boost).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		context.Status(200)
	}
}
