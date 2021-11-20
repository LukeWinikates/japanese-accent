package queries

import (
	"errors"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"gorm.io/gorm"
)

func FindSegmentsForPlaylist(db gorm.DB, count int) ([]database.VideoSegment, error) {
	segments := make([]database.VideoSegment, 0)
	var boosts []database.SegmentBoost
	uniqueElems := make(map[uint]bool)

	if err := db.
		Order("boosted_at DESC").
		Preload("Segment").
		FindInBatches(&boosts, count*2, func(tx *gorm.DB, batch int) error {
			for _, boost := range boosts {
				if len(uniqueElems) >= count {
					return errors.New("done")
				}
				if !uniqueElems[boost.Segment.ID] {
					segments = append(segments, boost.Segment)
					uniqueElems[boost.Segment.ID] = true
				}
			}

			return nil
		}).Error; err != nil {

		if err.Error() == "done" {
			return segments, nil
		}
		return nil, err
	}

	// query boosted segments not recently studied

	// query recently edited but not recently studied segments
	return segments, nil
}
