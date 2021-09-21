package core

import (
	_ "gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"time"
)

type Video struct {
	gorm.Model
	YoutubeID   string
	URL         string
	Title       string
	Segments    []VideoSegment
	VideoStatus VideoStatus
}

type VideoStatus = string

const (
	Pending  = "Pending"
	Imported = "Imported"
)

type VideoSegment struct {
	gorm.Model

	VideoID uint
	Start   int
	End     int
	Text    string
	UUID    string
}

type SegmentBoost struct {
	gorm.Model
	SegmentID uint
	Segment   VideoSegment
	BoostedAt time.Time
}

func InitializeDatabase(db gorm.DB) error {
	return db.AutoMigrate(Video{}, VideoSegment{}, SegmentBoost{})
}
