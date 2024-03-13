package handlers

import (
	"log"

	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/database/queries"
	"github.com/LukeWinikates/japanese-accent/internal/app/media"
	"github.com/LukeWinikates/japanese-accent/internal/app/vtt"
	"github.com/LukeWinikates/japanese-accent/internal/text"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func MakeVideoAdviceGET(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var video *database.Video

		youtubeID := context.Param("videoUuid")
		if err := db.Where("youtube_id = ?", youtubeID).First(&video).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		cues, err := media.LoadVTTCues(mediaDirectory, youtubeID)
		if err != nil {
			context.Status(500)
			log.Printf(err.Error())
			return
		}
		mutings, err := queries.GetAdviceMutings(db, youtubeID)
		if err != nil {
			context.Status(500)
			log.Printf(err.Error())
			return
		}

		advice := types.VideoAdviceResponse{
			SuggestedClips: suggestedClips(cues, youtubeID, mutings),
			TextSnippets:   snippetsFromVTT(cues),
		}

		context.JSON(200, advice)
	}
}

func snippetsFromVTT(cues []vtt.Cue) []types.TimedText {
	texts := make([]types.TimedText, 0)
	lastText := ""
	for _, c := range cues {
		_, nextText := text.RePartition(lastText, c.Text)
		if nextText == "" {
			continue
		}
		texts = append(texts, types.TimedText{
			Content: nextText,
			TimeMS:  c.StartMS,
		})
		lastText = c.Text
	}

	return texts
}

func suggestedClips(cues []vtt.Cue, videoUUID string, mutings []string) []types.SuggestedClip {
	muteMap := make(map[string]bool)
	for _, s := range mutings {
		muteMap[s] = true
	}
	clips := make([]types.SuggestedClip, 0)
	for _, t := range cues {
		labels := make([]string, 0)
		clipUUID := vtt.Sha(t)
		if muteMap[clipUUID] {
			labels = append(labels, "MUTED")
		} else {
			labels = append(labels, "ADVICE")
		}
		clips = append(clips, types.SuggestedClip{
			StartMS:   t.StartMS,
			EndMS:     t.EndMS,
			Text:      t.Text,
			UUID:      clipUUID,
			Labels:    labels,
			VideoUUID: videoUUID,
		})
	}
	return clips
}
