package queries

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/vtt"
	"gorm.io/gorm"
)

func MuteAdvice(db gorm.DB, video *database.Video, clipSHA string) error {
	return db.Model(video).Association("AdviceMutings").Append(&database.AdviceMuting{
		AdviceSha: clipSHA,
	})

}

func MuteAllAdvice(db gorm.DB, video *database.Video, advice []vtt.Cue) error {
	mutings := make([]*database.AdviceMuting, len(advice))
	for i, cue := range advice {
		mutings[i] = &database.AdviceMuting{
			AdviceSha: vtt.Sha(cue),
		}
	}

	return db.Model(video).Association("AdviceMutings").Replace(mutings)
}
