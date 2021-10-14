package database

import (
	_ "gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"time"
)

type Video struct {
	gorm.Model
	YoutubeID      string
	URL            string
	Title          string
	Segments       []VideoSegment
	VideoStatus    VideoStatus
	LastActivityAt time.Time
}

type VideoStatus = string

const (
	Pending  = "Pending"
	Imported = "Imported"
	Complete = "Complete"
)

type VideoSegment struct {
	gorm.Model

	VideoID        uint
	Start          int
	End            int
	Text           string
	UUID           string
	Video          Video
	LastActivityAt time.Time
	SegmentPitch   *SegmentPitch `gorm:"foreignKey:SegmentID"`
}

type SegmentBoost struct {
	gorm.Model
	SegmentID uint
	Segment   VideoSegment
	BoostedAt time.Time
}

type SegmentActivity struct {
	gorm.Model
	SegmentID    uint
	Segment      VideoSegment
	ActivityType SegmentActivityType
}

type SegmentActivityType = string

const (
	PracticeStart SegmentActivityType = "PracticeStart"
)

type SegmentPitch struct {
	gorm.Model
	SegmentID uint
	//Segment   VideoSegment
	Pattern string
	Source  string
	Morae   string
}

type Playlist struct {
	gorm.Model
	UUID     string
	Name     string
	Segments []VideoSegment `gorm:"many2many:playlist_segments"`
}

type Word struct {
	gorm.Model
	DisplayText string
	Furigana    string
	AccentMora  *int
}

type WordList struct {
	gorm.Model
	Name  string
	Words []Word `gorm:"many2many:wordlist_words"`
}

func InitializeDatabase(db gorm.DB) error {
	return db.AutoMigrate(Video{}, VideoSegment{}, SegmentBoost{}, SegmentActivity{}, Playlist{}, Word{}, WordList{}, SegmentPitch{})
}
