package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
	"time"
)

func MakeActivityPost(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var activityCreate types.ActivityCreateRequest
		if err := context.BindJSON(&activityCreate); err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		if activityCreate.ActivityType != database.PracticeStart {
			log.Printf("activity type was %s, did not match allowed values\n", activityCreate.ActivityType)
			context.Status(500)
			return
		}

		var segment *database.VideoSegment
		if err := db.Where("uuid = ? ", activityCreate.SegmentID).Preload("Video").Find(&segment).Error; err != nil {
			context.Status(404)
			log.Println(err.Error())
			return
		}

		activity := database.SegmentActivity{
			Segment:      *segment,
			ActivityType: activityCreate.ActivityType,
		}

		if err := db.Create(&activity).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		segment.LastActivityAt = time.Now()
		segment.Video.LastActivityAt = time.Now()

		if err := db.Save(segment).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		context.Status(200)
	}
}
