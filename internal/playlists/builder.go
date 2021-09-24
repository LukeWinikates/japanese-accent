package playlists

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/core"
	"gorm.io/gorm"
)

func MakeSmartPlaylist(db gorm.DB, count int) ([]core.VideoSegment, error) {
	segments := make([]core.VideoSegment, 0)

	var boosts []core.SegmentBoost

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
