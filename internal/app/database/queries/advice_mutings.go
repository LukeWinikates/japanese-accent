package queries

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"gorm.io/gorm"
)

func GetAdviceMutings(db gorm.DB, youtubeID string) ([]string, error) {
	var video *database.Video

	var mutings []string
	err := db.Where("youtube_id = ?", youtubeID).
		Preload("AdviceMutings").First(&video).Error

	if err != nil {
		return mutings, err
	}

	for _, m := range video.AdviceMutings {
		mutings = append(mutings, m.AdviceSha)
	}

	return mutings, err
}
