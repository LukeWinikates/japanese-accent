package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/media"
	"github.com/LukeWinikates/japanese-accent/internal/app/vtt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"log"
	"sort"

	//"github.com/google/uuid"
	"gorm.io/gorm"
)

func MakeVttTimingsGET(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var video *database.Video

		youtubeID := context.Param("videoUuid")
		if err := db.Where("youtube_id = ?", youtubeID).First(&video).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		vttFile := media.FindSubtitleFile(mediaDirectory, youtubeID)

		if !vttFile.IsFound {
			context.Status(404)
			return
		}

		file, err := ioutil.ReadFile(vttFile.Path)
		if err != nil {
			context.Status(500)
			log.Println(err.Error())
		}

		segments, err := vtt.ParseSegments(string(file))

		if err != nil {
			context.Status(500)
			log.Println(err.Error())
		}

		context.JSON(200, makeApiYttTimeline(segments))
	}
}

func makeApiYttTimeline(segments []vtt.Segment) types.VttTimeline {
	apiSegments := make([]types.VttSegment, 0)

	sort.Slice(segments, func(i, j int) bool {
		return segments[i].End < segments[j].End
	})

	for _, seg := range segments {
		apiSegments = append(apiSegments, types.VttSegment{
			Start: seg.Start,
			End:   seg.End,
			Text:  seg.Text,
		})
	}

	return types.VttTimeline{
		Segments:    apiSegments,
		DurationSec: apiSegments[len(apiSegments)-1].End,
	}
}
