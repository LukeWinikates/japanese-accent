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
	"os"
)

// TODO:
// * delete the old VTT timeline generator and structs

func MakeVideoAdviceGET(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var video *database.Video

		youtubeID := context.Param("videoUuid")
		if err := db.Where("youtube_id = ?", youtubeID).First(&video).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		vttTimings, _, vttSegments, err := loadVTTasAdvice(mediaDirectory, youtubeID)
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
			// TODO: are 'timings' still needed?
			Timings:           vttTimings,
			SuggestedSegments: suggestedSegments(vttSegments, mutings),
		}

		context.JSON(200, advice)
	}
}

func suggestedSegments(segments []vtt.Segment, mutings []string) []types.DraftSegment {
	muteMap := make(map[string]bool)
	for _, s := range mutings {
		muteMap[s] = true
	}
	segs := make([]types.DraftSegment, 0)
	for _, t := range segments {
		labels := make([]string, 0)
		segmentUUID := sha(t)
		if muteMap[segmentUUID] {
			labels = append(labels, "MUTED")
		}
		segs = append(segs, types.DraftSegment{
			StartMS: int(t.StartMS),
			EndMS:   int(t.EndMS),
			Text:    t.Text,
			UUID:    segmentUUID,
			Labels:  labels,
		})
	}
	return segs
}

func sha(t vtt.Segment) string {
	shaHasher := sha256.New()
	shaHasher.Write([]byte(fmt.Sprintf("%v %v %s", t.StartMS, t.EndMS, t.Text)))
	return base64.URLEncoding.EncodeToString(shaHasher.Sum(nil))
}

func loadVTTasAdvice(mediaDirectory string, youtubeID string) ([]types.Timing, []types.TimedText, []vtt.Segment, error) {
	vttFile := media.FindSubtitleFile(mediaDirectory, youtubeID)

	if !vttFile.IsFound {
		return nil, nil, nil, nil
	}
	file, err := os.ReadFile(vttFile.Path)
	if err != nil {
		return nil, nil, nil, err
	}

	segments, err := vtt.ParseSegments(string(file))

	if err != nil {
		return nil, nil, nil, err
	}

	return types.VTTSegmentsToTimings(segments), types.VTTSegmentsToTimedText(segments), segments, nil
}
