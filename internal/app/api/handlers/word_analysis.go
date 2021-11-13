package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/japanese"
	"github.com/LukeWinikates/japanese-accent/internal/forvo"
	"github.com/LukeWinikates/japanese-accent/internal/ojad"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
	"strconv"
	"strings"
)

func MakeWordAnalysisCREATE(db gorm.DB, settings database.Settings) gin.HandlerFunc {
	return func(context *gin.Context) {
		var analysisRequest types.WordAnalysisRequest

		if err := context.BindJSON(&analysisRequest); err != nil {
			context.Status(500)
			return
		}

		var existingWord *database.Word
		if err := db.Where("display_text", analysisRequest.Text).Where(&existingWord).Error; err != nil {

		}

		if existingWord != nil {
			context.JSON(200, wordAnalysisFromDatabaseWord(existingWord))
			return
		}

		audio := make([]types.AudioLinks, 0)
		if settings.ForvoApiKey != nil {
			log.Println("making forvo api call...")
			forvoClient := forvo.MakeClient(*settings.ForvoApiKey)
			pronunciations, err := forvoClient.GetPronunciations(analysisRequest.Text)
			if err != nil {
				log.Printf("unable to get forvo pronunciations: %s \n", err.Error())
			}

			audio = makeApiForvoLinks(pronunciations)
		}

		pitches, err := ojad.GetPitches(analysisRequest.Text)

		if err != nil {
			log.Printf("unable to get ojad pronunciations: %s \n", err.Error())
		}

		if len(pitches) < 1 {
			log.Printf("no ojad pronunciations for: %s \n", analysisRequest.Text)
		}

		moraAndPitchStrings := ojad.MakePitchAndMoraStrings(pitches)

		analysis := types.WordAnalysis{
			Text:    analysisRequest.Text,
			Pattern: moraAndPitchStrings.Pitch,
			Morae:   moraAndPitchStrings.Morae,
			Audio:   audio,
		}

		wordFromAnalysis := makeDatabaseWordFromAnalysis(analysis)
		if err := db.Save(&wordFromAnalysis).Error; err != nil {
			log.Printf("couldn't save analysis here due to error: %s \n", err.Error())
		}

		//links := makeAudioLinks(analysis.Audio)
		//
		//if err := db.Model(&wordFromAnalysis).Association("AudioLinks").
		//	Append(&links); err != nil {
		//	log.Printf("couldn't save links here due to error: %s \n", err.Error())
		//}

		context.JSON(201, analysis)
	}
}

func makeDatabaseWordFromAnalysis(analysis types.WordAnalysis) database.Word {
	accentedMora := japanese.AccentedMoraFromPattern(analysis.Pattern)
	return database.Word{
		DisplayText: analysis.Text,
		Furigana:    strings.ReplaceAll(analysis.Morae, " ", ""),
		AccentMora:  &accentedMora,
		AudioLinks:  makeAudioLinks(analysis.Audio),
	}
}

func makeAudioLinks(links []types.AudioLinks) []database.AudioLink {
	result := make([]database.AudioLink, 0)
	for _, link := range links {
		result = append(result, database.AudioLink{
			WordID:               0,
			SpeakerGender:        link.SpeakerGender,
			SpeakerUsername:      link.SpeakerUsername,
			URL:                  link.URL,
			ForvoPronunciationID: link.ForvoPronunciationID,
		})
	}
	return result
}

func wordAnalysisFromDatabaseWord(word *database.Word) types.WordAnalysis {
	morae := japanese.Morae(word.Furigana)
	pattern := ""
	if word.AccentMora != nil {
		pattern = japanese.PatternString(*word.AccentMora, len(morae))
	}
	return types.WordAnalysis{
		Text:     word.DisplayText,
		Furigana: word.Furigana,
		Pattern:  pattern,
		Morae:    strings.Join(morae, " "),
		Audio:    makeApiAudioLinks(word.AudioLinks),
	}
}

func makeApiAudioLinks(links []database.AudioLink) []types.AudioLinks {
	result := make([]types.AudioLinks, 0)
	for _, link := range links {
		result = append(result, types.AudioLinks{
			URL:                  link.URL,
			SpeakerUsername:      link.SpeakerUsername,
			SpeakerGender:        link.SpeakerGender,
			ForvoPronunciationID: link.ForvoPronunciationID,
		})
	}
	return result
}

func makeApiForvoLinks(pronunciations []forvo.Pronunciation) []types.AudioLinks {
	audio := make([]types.AudioLinks, 0)

	for _, p := range pronunciations {
		audio = append(audio, makeApiForvoLink(p))
	}

	return audio
}

func makeApiForvoLink(p forvo.Pronunciation) types.AudioLinks {
	return types.AudioLinks{
		URL:                  p.PathMP3,
		SpeakerUsername:      p.Username,
		SpeakerGender:        p.Sex,
		ForvoPronunciationID: strconv.Itoa(p.Id),
	}
}
