package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/database/queries"
	"github.com/LukeWinikates/japanese-accent/internal/app/vtt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"log"
	"net/http"
)

// TODO:
// * delete the old VTT timeline generator and structs

func MakeVideoAdviceSegmentDELETE(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var video *database.Video

		youtubeID := context.Param("videoUuid")
		segmentSha := context.Param("segmentSha")
		if err := db.Where("youtube_id = ?", youtubeID).
			Preload("Draft.DraftSegments").First(&video).Error; err != nil {
			context.Status(http.StatusInternalServerError)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		_, _, vttSegments, err := loadVTTasAdvice(mediaDirectory, youtubeID)

		found := false
		var segment vtt.Segment
		for _, seg := range vttSegments {
			if segmentSha == sha(seg) {
				found = true
				segment = seg
				break
			}
		}

		if !found {
			context.Status(http.StatusNotFound)
			return
		}

		if err != nil {
			context.Status(http.StatusInternalServerError)
			log.Printf(err.Error())
			return
		}
		_, err = queries.CreateDraftSegment(db, video, mutedSegment(segment, segmentSha))
		log.Printf("%v\n", err)
		if err != nil {
			context.Status(http.StatusInternalServerError)
			log.Printf(err.Error())
			return
		}

		context.Status(http.StatusNoContent)
	}
}

func mutedSegment(segment vtt.Segment, shaSum string) *database.DraftSegment {
	return &database.DraftSegment{
		StartMS:    uint(segment.StartMS),
		EndMS:      uint(segment.EndMS),
		Text:       "(muted)",
		UUID:       uuid.NewString(),
		ParentUUID: &shaSum,
		Labels:     []string{"MUTED"},
	}
}
