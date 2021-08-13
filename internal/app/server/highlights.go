package server

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/core"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
)

func MakeApiLinksFromDB(links []core.SegmentList) []ApiLink {
	apiLinks := make([]ApiLink, 0)
	for _, link := range links {
		apiLinks = append(apiLinks, ApiLink{
			VideoID: link.YoutubeID,
			URL:     link.URL,
			Text:    link.Text,
		})
	}
	return apiLinks
}

func MakeHandleHighlightsGET(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var videos *[]core.SegmentList

		if err := db.Find(&videos).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
		}

		log.Println(videos)

		context.JSON(200, ApiHighlights{
			Videos: MakeApiLinksFromDB(*videos),
		})
	}
}
