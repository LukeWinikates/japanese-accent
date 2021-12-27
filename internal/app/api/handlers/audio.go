package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/media"
	"github.com/gin-gonic/gin"
	"log"
)

func MakeAudioGET(mediaDirectory string) gin.HandlerFunc {
	return func(context *gin.Context) {
		videoId := context.Param("id")
		findResult := media.FindAudioFile(mediaDirectory, videoId)
		if findResult.Err != nil {
			log.Printf(findResult.Err.Error())
			context.Status(500)
		}

		context.File(findResult.Path)
	}
}
