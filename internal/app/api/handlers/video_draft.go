package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/database/queries"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
)

func MakeVideoDraftGET(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var video *database.Video

		youtubeID := context.Param("videoUuid")
		if err := db.Where("youtube_id = ?", youtubeID).
			Preload("Draft.DraftSegments").First(&video).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		if video.Draft == nil {
			videoWithDraft, err := queries.InitializeVideoDraft(db, video)
			if err != nil {
				context.Status(500)
				log.Printf("Error: %s\n", err.Error())
				return
			}
			video = videoWithDraft
		}

		advice := types.VideoDraftResponse{
			DraftSegments: draftSegments(video.Draft.DraftSegments),
		}

		context.JSON(200, advice)
	}
}

func draftSegments(segments []database.DraftSegment) []types.DraftSegment {
	segs := make([]types.DraftSegment, 0)
	for _, t := range segments {
		segs = append(segs, types.DraftSegment{
			StartMS: int(t.StartMS),
			EndMS:   int(t.EndMS),
			Text:    t.Text,
			UUID:    t.UUID,
		})
	}
	return segs
}
