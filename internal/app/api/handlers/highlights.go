package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/database/queries"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
)

func MakeApiVideoSummaries(videos []database.Video) []types.VideoSummary {
	apiVideoSummaries := make([]types.VideoSummary, 0)
	for _, video := range videos {
		apiVideoSummaries = append(apiVideoSummaries, types.VideoSummary{
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
		videos, err := queries.RecentlyActiveVideos(db, 8)
		if err != nil {
			log.Println(err.Error())
			context.Status(500)
		}

		context.JSON(200, types.Highlights{
			Videos: MakeApiVideoSummaries(*videos),
		})
	}
}
