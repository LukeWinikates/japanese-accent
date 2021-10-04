package api

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/handlers"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Configure(engine *gin.Engine, wordsFilePath, mediaDirPath string, db gorm.DB) {
	engine.Static("/public", "./web/public")
	engine.StaticFile("/", "./web/public/index.html")

	api := engine.Group("/api")
	{
		api.GET("/highlights", handlers.MakeHandleHighlightsGET(db))
		api.POST("/recordings", handlers.HandleRecordingUpload)

		api.GET("/categories", handlers.MakeHandleCategoriesGET(wordsFilePath, db))
		api.GET("/categories/*category", handlers.MakeHandleCategoryGET(wordsFilePath))

		api.POST("/boosts", handlers.MakeBoostPOST(db))

		api.POST("/activity", handlers.MakeActivityPost(db))

		api.POST("/playlists", handlers.MakePlaylistPost(db))
		api.GET("/playlists/:id", handlers.MakePlaylistGET(db))

		api.POST("/videos/", handlers.MakeVideoPOST(db))
		api.GET("/videos/", handlers.MakeVideoListGET(db))
		api.GET("/videos/:videoUuid", handlers.MakeVideoGET(mediaDirPath, db))
		api.POST("/videos/:videoUuid/publish", handlers.MakeVideoPublishPOST(db))
		api.POST("/videos/:videoUuid/segments/", handlers.MakeAudioSegmentsCREATE(db))
		api.PUT("/videos/:videoUuid/segments/:id", handlers.MakeAudioSegmentsPOST(db))
		api.DELETE("/videos/:videoUUid/segments/:id", handlers.MakeAudioSegmentsDELETE(db))
	}

	media := engine.Group("/media")
	{
		media.GET("/audio/:id", handlers.MakeAudioGET(mediaDirPath))
	}
}
