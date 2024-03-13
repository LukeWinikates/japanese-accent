package handlers

import (
	"fmt"
	"log"
	"strconv"

	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/media"
	waveform2 "github.com/LukeWinikates/japanese-accent/internal/waveform"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func MakeWaveformGET(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
	defaultWaveformSampleRate := 1000

	return func(context *gin.Context) {
		var video *database.Video

		youtubeID := context.Param("videoUuid")
		sampleRateString := context.Query("sample_rate")
		var err error

		if err := db.Where("youtube_id = ?", youtubeID).First(&video).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		sampleRate := defaultWaveformSampleRate
		if sampleRateString != "" {
			sampleRate, err = strconv.Atoi(sampleRateString)
		}
		if err != nil {
			context.Status(400)
			context.JSON(400, types.ErrorResponse{
				Message: fmt.Sprintf("invalid parameter value for sample_rate: %s", sampleRateString),
			})
		}

		source := media.FindAudioFile(mediaDirectory, youtubeID)
		if !source.IsFound {
			context.Status(404)
			return
		}
		samples, err := waveform2.Waveform(source.Path, sampleRate)
		if err != nil {
			context.Status(500)
			log.Printf("Error generating waveform: %s\n", err.Error())
			return
		}

		context.JSON(200, map[string]interface{}{
			"samples":    samples,
			"sampleRate": sampleRate,
		})
	}
}
