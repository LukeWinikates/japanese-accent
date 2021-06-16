package core

import (
	_ "gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type SegmentList struct {
	gorm.Model
	YoutubeID string
	Segments  []Segment
}

type Segment struct {
	gorm.Model

	SegmentListID uint
	Start         int
	End           int
	Text          string
	UUID          string
}

func InitializeDatabase(db gorm.DB) error {
	return db.AutoMigrate(SegmentList{}, Segment{})
}
