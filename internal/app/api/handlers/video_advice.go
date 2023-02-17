package handlers

import (
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/database/queries"
	"github.com/LukeWinikates/japanese-accent/internal/app/media"
	"github.com/LukeWinikates/japanese-accent/internal/app/vtt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
)

func MakeVideoAdviceGET(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var video *database.Video

		youtubeID := context.Param("videoUuid")
		if err := db.Where("youtube_id = ?", youtubeID).First(&video).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		vttSegments, err := media.LoadVTTasAdvice(mediaDirectory, youtubeID)
		if err != nil {
			context.Status(500)
			log.Printf(err.Error())
			return
		}
		mutings, err := queries.GetAdviceMutings(db, youtubeID)
		if err != nil {
			context.Status(500)
			log.Printf(err.Error())
			return
		}

		advice := types.VideoAdviceResponse{
			SuggestedSegments: suggestedSegments(vttSegments, youtubeID, mutings),
		}

		context.JSON(200, advice)
	}
}

func suggestedSegments(segments []vtt.Segment, videoUUID string, mutings []string) []types.SuggestedSegment {
	muteMap := make(map[string]bool)
	for _, s := range mutings {
		muteMap[s] = true
	}
	segs := make([]types.SuggestedSegment, 0)
	for _, t := range segments {
		labels := make([]string, 0)
		segmentUUID := sha(t)
		if muteMap[segmentUUID] {
			labels = append(labels, "MUTED")
		} else {
			labels = append(labels, "ADVICE")
		}
		segs = append(segs, types.SuggestedSegment{
			StartMS:   t.StartMS,
			EndMS:     t.EndMS,
			Text:      t.Text,
			UUID:      segmentUUID,
			Labels:    labels,
			VideoUUID: videoUUID,
		})
	}
	return segs
}

func sha(t vtt.Segment) string {
	shaHasher := sha256.New()
	shaHasher.Write([]byte(fmt.Sprintf("%v %v %s", t.StartMS, t.EndMS, t.Text)))
	return base64.URLEncoding.EncodeToString(shaHasher.Sum(nil))
}
