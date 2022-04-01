package queries

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"gorm.io/gorm"
)

func InitializeVideoDraft(db gorm.DB, video *database.Video) (*database.Video, error) {
	draft := database.VideoDraft{
		VideoID:       video.ID,
		DraftSegments: []database.DraftSegment{},
	}

	if err := db.Save(&draft).Error; err != nil {
		return nil, err
	}

	return video, nil
}
