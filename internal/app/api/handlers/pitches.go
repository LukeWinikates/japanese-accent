package handlers

import (
	"log"

	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/ojad"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func MakeClipPitchesCREATE(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		clipID := context.Param("id")

		var clip *database.Clip
		if err := db.Where("uuid = ? ", clipID).Find(&clip).Error; err != nil {

			log.Println(err.Error())
			context.Status(404)
			return
		}

		pitches, err := ojad.GetPitches(clip.Text)

		if err != nil {
			log.Println(err.Error())
			context.Status(500)
		}

		normalized := ojad.MakePitchAndMoraStrings(pitches)

		dbPitch := database.ClipPitch{
			Morae:   normalized.Morae,
			Pattern: normalized.Pitch,
			Source:  "OJAD",
		}
		if err := db.Model(&clip).Association("ClipPitch").Replace(&dbPitch); err != nil {

			log.Println(err.Error())
			context.Status(500)
			return
		}

		context.JSON(201, makeAPIPitch(dbPitch))
	}
}

func makeAPIPitch(pitch database.ClipPitch) types.ClipPitch {
	return types.ClipPitch{
		Pattern: pitch.Pattern,
		Morae:   pitch.Morae,
	}
}
