package handlers

import (
	"log"

	"github.com/LukeWinikates/japanese-accent/internal/app/media"
	"github.com/gin-gonic/gin"
)

func MakeAudioGET(mediaDirectory string) gin.HandlerFunc {
	return func(context *gin.Context) {
		videoId := context.Param("id")
		findResult := media.FindAudioFile(mediaDirectory, videoId)
		if findResult.Err != nil {
			log.Println(findResult.Err.Error())
			context.Status(500)
		}

		context.File(findResult.Path)
	}
}
