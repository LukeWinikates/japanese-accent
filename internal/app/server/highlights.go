package server

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/core"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
)

func MakeApiVideoSummaries(videos []core.Video) []ApiVideoSummary {
	apiVideoSummaries := make([]ApiVideoSummary, 0)
	for _, video := range videos {
		apiVideoSummaries = append(apiVideoSummaries, ApiVideoSummary{
			Title:          video.Title,
			URL:            video.URL,
			VideoID:        video.YoutubeID,
			VideoStatus:    video.VideoStatus,
			LastActivityAt: video.LastActivityAt,
		})
	}
	return apiVideoSummaries
}

func MakeHandleHighlightsGET(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var videos *[]core.Video

		if err := db.Find(&videos).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
		}

		log.Println(videos)

		context.JSON(200, ApiHighlights{
			Videos: MakeApiVideoSummaries(*videos),
		})
	}
}
