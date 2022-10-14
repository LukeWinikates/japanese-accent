package queries

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	_ "gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func CreateDraftSegment(db gorm.DB, video *database.Video, segment *database.DraftSegment) (*database.DraftSegment, error) {
	err := db.Model(&video.Draft).
		Association("DraftSegments").
		Append(segment)

	return segment, err
}
