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

		var clip *database.Clip
		if err := db.Where("uuid = ? ", boostRequest.ClipID).Find(&clip).Error; err != nil {
			context.Status(404)
			log.Println(err.Error())
			return
		}

		boost := database.ClipBoost{
			Clip:      *clip,
			BoostedAt: time.Now(),
		}

		if err := db.Save(&boost).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		clip.Priority = clip.Priority + database.BoostPriority

		if err := db.Save(clip).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
		}

		context.Status(200)
	}
}
