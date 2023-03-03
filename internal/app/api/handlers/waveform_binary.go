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

func MakeWaveformBinaryGET(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var video *database.Video

		youtubeID := context.Param("videoUuid")
		if err := db.Where("youtube_id = ?", youtubeID).First(&video).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}
		rate := 200

		waveform := media.FindWaveformBinaryFile(mediaDirectory, youtubeID, rate)

		if !waveform.IsFound {
			fmt.Println("got here")

			source := media.FindAudioFile(mediaDirectory, youtubeID)
			if !source.IsFound {
				context.Status(404)
				return
			}
			tmpFile, err := waveform2.WaveformTempFile(source.Path, rate)
			if err != nil {
				context.Status(500)
				log.Printf("Error: %s\n", err.Error())
				return
			}
			err = media.WriteWaveformBinaryFile(mediaDirectory, youtubeID, tmpFile, rate)

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
