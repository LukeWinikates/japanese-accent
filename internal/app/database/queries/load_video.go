package queries

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"gorm.io/gorm"
)

func LoadVideo(db gorm.DB, youtubeID string) (*database.Video, error) {
	var video *database.Video

	if err := db.Preload("Clips", func(db *gorm.DB) *gorm.DB {
		return db.Order("clips.start_ms ASC")
	}).Preload("Clips.ClipPitch").
		Preload("Words").Where("youtube_id = ?", youtubeID).First(&video).Error; err != nil {

		return nil, err
	}

	return video, nil
}
