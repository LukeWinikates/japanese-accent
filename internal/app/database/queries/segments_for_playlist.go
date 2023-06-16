package queries

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"gorm.io/gorm"
)

func FindClipsForPlaylist(db gorm.DB, count int) ([]database.Clip, error) {
	clips := make([]database.Clip, 0)

	if err := db.
		Order("priority DESC").
		Limit(count).
		Find(&clips).Error; err != nil {

		return nil, err
	}

	return clips, nil
}
