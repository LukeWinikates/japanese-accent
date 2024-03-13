package queries

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"gorm.io/gorm"
)

func RecentlyActiveVideos(db gorm.DB, count int) (*[]database.Video, error) {
	var videos *[]database.Video
	err := db.Order("last_activity_at DESC").
		Limit(count).Find(&videos).Error
	return videos, err
}
