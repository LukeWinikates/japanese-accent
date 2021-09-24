package server

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"mime/multipart"
)

type Persister interface {
	PersistFile(file *multipart.FileHeader) error
}

func Configure(engine *gin.Engine, wordsFilePath, mediaDirPath string, db gorm.DB) {
	engine.Static("/public", "./web/public")
	engine.StaticFile("/", "./web/public/index.html")

	api := engine.Group("/api")
	{
		api.GET("/highlights", MakeHandleHighlightsGET(db))
		api.POST("/recordings", HandleRecordingUpload)
		api.GET("/categories", MakeHandleCategoriesGET(wordsFilePath, db))
		api.GET("/categories/*category", MakeHandleCategoryGET(wordsFilePath))
		api.POST("/videos/", MakeVideoPOST(db))
		api.GET("/videos/:id", MakeVideoGET(mediaDirPath, db))
		api.POST("/boosts", MakeBoostPOST(db))
		api.POST("/activity", MakeActivityPost(db))
		api.POST("/playlists", MakePlaylistPost(db))
		api.GET("/playlists/:id", MakePlaylistGET(db))
	}

	media := engine.Group("/media")
	{
		media.POST("/audio/:audioId/segments/:id", MakeAudioSegmentsPOST(db))
		media.POST("/audio/:audioId/segments/", MakeAudioSegmentsCREATE(db))
		media.DELETE("/audio/:audioId/segments/:id", MakeAudioSegmentsDELETE(db))
		media.GET("/audio/:id", MakeAudioGET(mediaDirPath))
	}
}
