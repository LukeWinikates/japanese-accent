package queries

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"gorm.io/gorm"
)

func MuteAdvice(db gorm.DB, video *database.Video, segmentSha string) error {
	return db.Model(video).Association("AdviceMutings").Append(&database.AdviceMuting{
		AdviceSha: segmentSha,
	})

}
