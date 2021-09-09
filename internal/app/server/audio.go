package server

import (
	"github.com/gin-gonic/gin"
	"io/fs"
	"log"
	"os"
)

func MakeAudioGET(mediaDirectory string) gin.HandlerFunc {
	return func(context *gin.Context) {
		mediaDir := os.DirFS(mediaDirectory)
		videoId := context.Param("id")
		files, err := fs.Glob(mediaDir, videoId+"*.m*")
		if err != nil {
			log.Printf(err.Error())
			context.Status(500)
		}

		if len(files) == 0 {
			log.Println("no files found!")
			context.Status(404)
		}
		context.File(mediaDirectory + "/" + files[0])
	}
}
