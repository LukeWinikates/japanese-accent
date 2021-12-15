package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
)

func MakeAppSettingsGET(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var settings database.Settings

		if err := db.
			First(&settings).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		context.JSON(200, types.ApplicationSettings{
			ForvoAPIKey: settings.ForvoApiKey,
		})
	}
}

func MakeAppSettingsPUT(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var request types.ApplicationSettingsChangeRequest

		if err := context.BindJSON(&request); err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		var settings database.Settings

		if err := db.
			First(&settings).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		settings.ForvoApiKey = request.ForvoAPIKey

		if err := db.Save(&settings).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
		}

		context.JSON(200, types.ApplicationSettings{
			ForvoAPIKey: settings.ForvoApiKey,
		})
	}
}
