package api

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/handlers"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Configure(engine *gin.Engine, mediaDirPath string, db gorm.DB) {
	engine.Static("/public", "./web/public")
	engine.StaticFile("/", "./web/public/index.html")

	api := engine.Group("/api")
	{
		api.GET("/highlights", handlers.MakeHandleHighlightsGET(db))
		api.POST("/recordings", handlers.HandleRecordingUpload)

		api.POST("/boosts", handlers.MakeBoostPOST(db))

		api.POST("/activity", handlers.MakeActivityPost(db))

		api.POST("/playlists", handlers.MakePlaylistPost(db))
		api.GET("/playlists/:id", handlers.MakePlaylistGET(db))

		videos := api.Group("/videos/")
		{
			videos.POST("", handlers.MakeVideoPOST(db))
			videos.GET("", handlers.MakeVideoListGET(db))
			videos.GET(":videoUuid", handlers.MakeVideoGET(mediaDirPath, db))
			videos.PUT(":videoUuid", handlers.MakeVideoPUT(db))
			videos.POST(":videoUuid/publish", handlers.MakeVideoPublishPOST(db))
			videos.POST(":videoUuid/segments/", handlers.MakeAudioSegmentsCREATE(db))
			videos.PUT(":videoUuid/segments/:id", handlers.MakeAudioSegmentsPOST(db))
			videos.DELETE(":videoUuid/segments/:id", handlers.MakeAudioSegmentsDELETE(db))
		}

		api.POST("/segments/:id/pitches", handlers.MakeSegmentPitchesCREATE(db))

		wordLists := api.Group("/wordlists/")
		{
			wordLists.GET(":id", handlers.MakeWordListGET(db))
			wordLists.GET("", handlers.MakeWordListListGET(db))
		}
	}

	media := engine.Group("/media")
	{
		media.GET("/audio/:id", handlers.MakeAudioGET(mediaDirPath))
	}
}
