package core

import (
	_ "gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Video struct {
	gorm.Model
	YoutubeID string
	URL       string
	Title     string
	Segments  []VideoSegment
}

type VideoSegment struct {
	gorm.Model

	VideoID uint
	Start   int
	End     int
	Text    string
	UUID    string
}

func InitializeDatabase(db gorm.DB) error {
	return db.AutoMigrate(Video{}, VideoSegment{})
}
