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
		api.GET("/categories", MakeHandleCategoriesGET(wordsFilePath))
		api.GET("/categories/*category", MakeHandleCategoryGET(wordsFilePath))
	}

	media := engine.Group("/media")
	{
		media.GET("/audio/:id/segments", MakeAudioSegmentsGET(mediaDirPath, db))
		media.POST("/audio/:audioId/segments/:id", MakeAudioSegmentsPOST(db))
		media.DELETE("/audio/:audioId/segments/:id", MakeAudioSegmentsDELETE(db))
		media.GET("/audio/:id", MakeAudioGET(mediaDirPath))
	}
}
