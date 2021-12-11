package queries

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"gorm.io/gorm"
)

func FindSegmentsForPlaylist(db gorm.DB, count int) ([]database.VideoSegment, error) {
	segments := make([]database.VideoSegment, 0)

	if err := db.
		Order("priority DESC").
		Limit(count).
		Find(&segments).Error; err != nil {

		return nil, err
	}

	return segments, nil
}
