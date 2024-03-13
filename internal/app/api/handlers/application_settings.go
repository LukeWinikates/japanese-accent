package handlers

import (
	"log"

	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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
			ForvoAPIKey:     settings.ForvoAPIKey,
			AudioExportPath: settings.AudioExportPath,
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
		if request.ForvoAPIKey != nil {
			settings.ForvoAPIKey = request.ForvoAPIKey
		}

		if request.AudioExportPath != nil {
			settings.AudioExportPath = request.AudioExportPath
		}

		if err := db.Save(&settings).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
		}

		context.JSON(200, types.ApplicationSettings{
			ForvoAPIKey:     settings.ForvoAPIKey,
			AudioExportPath: settings.AudioExportPath,
		})
	}
}
