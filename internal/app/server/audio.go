package server

import (
	"github.com/gin-gonic/gin"
	"io/fs"
	"log"
	"os"
)

func MakeAudioGET(mediaDirectory string) gin.HandlerFunc {
	return func(context *gin.Context) {
		videoId := context.Param("id")
		findResult := FindMediaFile(mediaDirectory, videoId)
		if findResult.Err != nil {
			log.Printf(findResult.Err.Error())
			context.Status(500)
		}

		context.File(findResult.Path)
	}
}

func FindMediaFile(mediaDirectory string, videoId string) MediaFileFindResult {
	mediaDir := os.DirFS(mediaDirectory)
	files, err := fs.Glob(mediaDir, videoId+"*.m*")
	if err != nil {
		return MediaFileFindResult{
			IsFound: false,
			Path:    "",
			Err:     err,
		}
	}
	if len(files) == 0 {
		return MediaFileFindResult{
			IsFound: false,
			Path:    "",
			Err:     nil,
		}
	}
	return MediaFileFindResult{
		IsFound: true,
		Path:    mediaDirectory + "/" + files[0],
		Err:     nil,
	}
}

type MediaFileFindResult struct {
	IsFound bool
	Path    string
	Err     error
}
