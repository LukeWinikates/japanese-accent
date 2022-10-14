package queries

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"gorm.io/gorm"
)

func GetAdviceMutings(db gorm.DB, youtubeID string) ([]string, error) {
	var video *database.Video

	var mutings []string
	err := db.Where("youtube_id = ?", youtubeID).
		Preload("Draft.DraftSegments").First(&video).Error

	if err != nil {
		return mutings, err
	}

	for _, s := range video.Draft.DraftSegments {
		if s.HasLabel("MUTED") && s.ParentUUID != nil {
			mutings = append(mutings, *s.ParentUUID)
		}
	}

	return mutings, err
}
