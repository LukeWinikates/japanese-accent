package queries

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"gorm.io/gorm"
)

func FindSegmentsForPlaylist(db gorm.DB, count int) ([]database.VideoSegment, error) {
	segments := make([]database.VideoSegment, 0)

	var boosts []database.SegmentBoost

	if err := db.Limit(count).
		Order("boosted_at").
		Preload("Segment").
		Find(&boosts).Error; err != nil {
		return nil, err
	}

	for _, boost := range boosts {
		segments = append(segments, boost.Segment)
	}

	// query boosted segments not recently studied

	// query recently edited but not recently studied segments

	return segments, nil
}
