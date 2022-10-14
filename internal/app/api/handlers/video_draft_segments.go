package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/database/queries"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"log"
)

func MakeVideoDraftSegmentsPOST(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var video *database.Video
		var segment *types.DraftSegmentCreateRequest

		if err := context.BindJSON(&segment); err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		youtubeID := context.Param("videoUuid")
		if err := db.Where("youtube_id = ?", youtubeID).
			Preload("Draft.DraftSegments").First(&video).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		if video.Draft == nil {
			context.Status(500)
		}

		dbSegment, err := queries.CreateDraftSegment(db, video, draftSegment(segment))

		if err != nil {
			log.Printf(err.Error())
		}
		// TODO: mute segments

		context.JSON(201, apiDraftSegment(dbSegment))
	}
}

func apiDraftSegment(segment *database.DraftSegment) types.DraftSegment {
	return types.DraftSegment{
		StartMS:    int(segment.StartMS),
		EndMS:      int(segment.EndMS),
		Text:       segment.Text,
		UUID:       segment.UUID,
		ParentUUID: segment.ParentUUID,
	}
}

func draftSegment(segment *types.DraftSegmentCreateRequest) *database.DraftSegment {
	return &database.DraftSegment{
		StartMS:    uint(segment.StartMS),
		EndMS:      uint(segment.EndMS),
		Text:       segment.Text,
		UUID:       uuid.NewString(),
		ParentUUID: segment.ParentUUID,
		Labels:     []string{"DRAFT"},
	}
}
