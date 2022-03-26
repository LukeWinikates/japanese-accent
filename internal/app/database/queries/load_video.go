package queries

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"gorm.io/gorm"
)

func LoadVideo(db gorm.DB, youtubeID string) (*database.Video, error) {
	var video *database.Video

	if err := db.Preload("Segments", func(db *gorm.DB) *gorm.DB {
		return db.Order("video_segments.start ASC")
	}).Preload("Segments.SegmentPitch").
		Preload("Words").Where("youtube_id = ?", youtubeID).First(&video).Error; err != nil {

		return nil, err
	}

	return video, nil
}
