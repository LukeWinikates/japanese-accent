package handlers

import (
	"fmt"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/media"
	waveform2 "github.com/LukeWinikates/japanese-accent/internal/waveform"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
	"os"
)

func MakeWaveformGET(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var video *database.Video

		youtubeID := context.Param("videoUuid")
		if err := db.Where("youtube_id = ?", youtubeID).First(&video).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		waveform := media.FindWaveformFile(mediaDirectory, youtubeID)

		if !waveform.IsFound {
			fmt.Println("got here")

			source := media.FindAudioFile(mediaDirectory, youtubeID)
			if !source.IsFound {
				context.Status(404)
				return
			}
			rate := 8000
			int16s, err := waveform2.Waveform(source.Path, rate)
			if err != nil {
				context.Status(500)
				log.Printf("Error: %s\n", err.Error())
				return
			}
			err = media.WriteWaveformFile(mediaDirectory, youtubeID, int16s, rate)

			if err != nil {
				context.Status(500)
				log.Printf("Error: %s\n", err.Error())
				return
			}
		}
		_, err := os.Open(waveform.Path)
		fmt.Println(os.IsNotExist(err))

		context.File(waveform.Path)
	}
}
