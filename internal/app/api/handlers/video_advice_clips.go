package handlers

import (
	"log"
	"net/http"

	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/database/queries"
	"github.com/LukeWinikates/japanese-accent/internal/app/media"
	"github.com/LukeWinikates/japanese-accent/internal/app/slices"
	"github.com/LukeWinikates/japanese-accent/internal/app/vtt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func MakeSuggestedClipDELETE(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var video *database.Video

		youtubeID := context.Param("videoUuid")
		clipSHA := context.Param("sha")
		if err := db.Where("youtube_id = ?", youtubeID).
			Preload("AdviceMutings").First(&video).Error; err != nil {
			context.Status(http.StatusInternalServerError)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		if slices.Any(video.AdviceMutings, func(m database.AdviceMuting) bool {
			return m.AdviceSha == clipSHA
		}) {
			context.Status(http.StatusNoContent)
			return

		}

		vttAdvice, err := media.LoadVTTCues(mediaDirectory, youtubeID)

		found := false
		for _, seg := range vttAdvice {
			if clipSHA == vtt.Sha(seg) {
				found = true
				break
			}
		}

		if !found {
			context.Status(http.StatusNotFound)
			return
		}

		if err != nil {
			context.Status(http.StatusInternalServerError)
			log.Printf(err.Error())
			return
		}
		err = queries.MuteAdvice(db, video, clipSHA)
		log.Printf("%v\n", err)
		if err != nil {
			context.Status(http.StatusInternalServerError)
			log.Printf(err.Error())
			return
		}

		context.Status(http.StatusNoContent)
	}
}

func MakeSuggestedClipsDELETE(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var video *database.Video

		youtubeID := context.Param("videoUuid")
		if err := db.Where("youtube_id = ?", youtubeID).First(&video).Error; err != nil {
			context.Status(http.StatusInternalServerError)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		vttAdvice, err := media.LoadVTTCues(mediaDirectory, youtubeID)

		if err != nil {
			context.Status(http.StatusInternalServerError)
			log.Printf(err.Error())
			return
		}
		err = queries.MuteAllAdvice(db, video, vttAdvice)
		log.Printf("%v\n", err)
		if err != nil {
			context.Status(http.StatusInternalServerError)
			log.Printf(err.Error())
			return
		}

		context.Status(http.StatusNoContent)
	}
}
