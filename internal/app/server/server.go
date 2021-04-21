package server

import (
	"github.com/gin-gonic/gin"
	"mime/multipart"
)

type Persister interface {
	PersistFile(file *multipart.FileHeader) error
}

func Configure(engine *gin.Engine, wordsFilePath string) {
	engine.Static("/public", "./web/public")
	engine.StaticFile("/", "./web/public/index.html")

	api := engine.Group("/api")
	{
		api.POST("/recordings", HandleRecordingUpload)
		api.GET("/categories", MakeHandleCategoriesGET(wordsFilePath))
		api.GET("/categories/*category", MakeHandleCategoryGET(wordsFilePath))
	}
}
