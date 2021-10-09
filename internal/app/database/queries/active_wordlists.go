package queries

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	_ "gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func RecentlyActiveWordLists(db gorm.DB, count int) (*[]database.WordList, error) {
	var wordLists *[]database.WordList
	err := db.Preload("Words").Order("id DESC").
		Limit(count).Find(&wordLists).Error
	return wordLists, err
}
