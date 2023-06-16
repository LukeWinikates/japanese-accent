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

		var clip *database.Clip
		if err := db.Where("uuid = ? ", activityCreate.ClipID).Preload("Video").Find(&clip).Error; err != nil {
			context.Status(404)
			log.Println(err.Error())
			return
		}

		activity := database.ClipActivity{
			Clip:         *clip,
			ActivityType: activityCreate.ActivityType,
		}

		if err := db.Create(&activity).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		clip.LastActivityAt = time.Now()
		clip.Video.LastActivityAt = time.Now()

		clip.Priority = clip.Priority + database.ActivityPriority

		if err := db.Save(clip).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}
		if err := db.Save(clip.Video).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		context.Status(200)
	}
}
