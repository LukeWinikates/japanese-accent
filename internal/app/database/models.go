package database

import (
	_ "gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
	"time"
)

type Settings struct {
	gorm.Model
	ForvoApiKey     *string
	AudioExportPath *string
}

type Video struct {
	gorm.Model
	YoutubeID      string
	Title          string
	Clips          []Clip
	Text           string
	LastActivityAt time.Time
	Words          []Word `gorm:"many2many:video_words"`
	AdviceMutings  []AdviceMuting
}

type Clip struct {
	gorm.Model
	VideoID        uint
	StartMS        int
	EndMS          int
	Text           string
	UUID           string
	Video          Video
	LastActivityAt time.Time
	ClipPitch      *ClipPitch `gorm:"foreignKey:ClipID"`
	Priority       int
	ParentUUID     *string
	Labels         Labels `gorm:"serializer:json"`
}

type ClipBoost struct {
	gorm.Model
	ClipID    uint
	Clip      Clip
	BoostedAt time.Time
}

type ClipActivity struct {
	gorm.Model
	ClipID       uint
	Clip         Clip
	ActivityType ClipActivityType
}

type ClipActivityType = string

const (
	PracticeStart ClipActivityType = "PracticeStart"
)

type ClipPitch struct {
	gorm.Model
	ClipID  uint
	Pattern string
	Source  string
	Morae   string
}

type Playlist struct {
	gorm.Model
	UUID  string
	Name  string
	Clips []Clip `gorm:"many2many:playlist_clips"`
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

type AdviceMuting struct {
	gorm.Model
	VideoID   uint
	AdviceSha string
}

func InitializeDatabase(db gorm.DB) error {
	return db.AutoMigrate(
	//Video{}, Clip{},
	//ClipBoost{},
	//ClipActivity{},
	//Playlist{}, Word{},
	//WordList{}, ClipPitch{},
	//Settings{}, AdviceMuting{},
	)
}

func EnsureDatabaseReady(db gorm.DB) error {
	var settings *Settings
	if err := db.First(&settings).Error; err != nil {
		log.Println("initializing settings")
		if err := db.Save(&Settings{}).Error; err != nil {
			return err
		}
	}

	return nil
}
