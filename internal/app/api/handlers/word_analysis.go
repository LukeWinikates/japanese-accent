package handlers

import (
	"context"
	"log"
	"strconv"
	"strings"

	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/japanese"
	"github.com/LukeWinikates/japanese-accent/internal/forvo"
	"github.com/LukeWinikates/japanese-accent/internal/ojad"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func MakeWordAnalysisCREATE(db gorm.DB, forvoClient forvo.Client) gin.HandlerFunc {

	return func(context *gin.Context) {
		var analysisRequest types.WordAnalysisRequest

		if err := context.BindJSON(&analysisRequest); err != nil {
			context.Status(500)
			return
		}

		var existingWord *database.Word
		if err := db.Where("display_text", analysisRequest.Text).Where(&existingWord).Error; err != nil {
			context.Status(500)
		}

		if existingWord != nil {
			context.JSON(200, wordAnalysisFromDatabaseWord(context, existingWord, forvoClient))
			return
		}

		pronunciations, err := forvoClient.GetPronunciations(context, analysisRequest.Text)
		if err != nil {
			log.Printf("unable to get forvo pronunciations: %s \n", err.Error())
		}

		audio := makeAPIForvoLinks(pronunciations)

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

		context.JSON(201, analysis)
	}
}

func MakeWordAnalysisGET(db gorm.DB, forvoClient forvo.Client) gin.HandlerFunc {

	return func(context *gin.Context) {

		var wordText = context.Param("word")

		pronunciations, err := forvoClient.GetPronunciations(context, wordText)
		if err != nil {
			log.Printf("unable to get forvo pronunciations: %s \n", err.Error())
		}

		audio := makeAPIForvoLinks(pronunciations)

		var existingWord *database.Word
		if err := db.Where("display_text", wordText).Where(&existingWord).Error; err != nil {
			context.Status(500)
		}

		if existingWord != nil {
			response := wordAnalysisFromDatabaseWord(context, existingWord, forvoClient)
			response.Audio = audio
			context.JSON(200, response)
			return
		}

		pitches, err := ojad.GetPitches(wordText)

		if err != nil {
			log.Printf("unable to get ojad pronunciations: %s \n", err.Error())
		}

		if len(pitches) < 1 {
			log.Printf("no ojad pronunciations for: %s \n", wordText)
		}

		moraAndPitchStrings := ojad.MakePitchAndMoraStrings(pitches)

		analysis := types.WordAnalysis{
			Text:    wordText,
			Pattern: moraAndPitchStrings.Pitch,
			Morae:   moraAndPitchStrings.Morae,
			Audio:   audio,
		}

		wordFromAnalysis := makeDatabaseWordFromAnalysis(analysis)
		if err := db.Save(&wordFromAnalysis).Error; err != nil {
			log.Printf("couldn't save analysis here due to error: %s \n", err.Error())
		}

		context.JSON(201, analysis)
	}
}

func makeDatabaseWordFromAnalysis(analysis types.WordAnalysis) database.Word {
	accentedMora := japanese.AccentedMoraFromPattern(analysis.Pattern)
	return database.Word{
		DisplayText: analysis.Text,
		Furigana:    strings.ReplaceAll(analysis.Morae, " ", ""),
		AccentMora:  &accentedMora,
	}
}

func wordAnalysisFromDatabaseWord(context context.Context, word *database.Word, forvoClient forvo.Client) types.WordAnalysis {
	morae := japanese.Morae(word.Furigana)
	pattern := ""
	if word.AccentMora != nil {
		pattern = japanese.PatternString(*word.AccentMora, len(morae))
	}

	pronunciations, err := forvoClient.GetPronunciations(context, word.DisplayText)

	links := make([]types.AudioLink, 0)

	if err == nil {
		links = makeAPIForvoLinks(pronunciations)
	}

	return types.WordAnalysis{
		Text:     word.DisplayText,
		Furigana: word.Furigana,
		Pattern:  pattern,
		Morae:    strings.Join(morae, " "),
		Audio:    links,
	}
}

func makeAPIForvoLinks(pronunciations []forvo.Pronunciation) []types.AudioLink {
	audio := make([]types.AudioLink, 0)

	for _, p := range pronunciations {
		audio = append(audio, makeAPIForvoLink(p))
	}

	return audio
}

func makeAPIForvoLink(p forvo.Pronunciation) types.AudioLink {
	return types.AudioLink{
		URL:                  p.PathMP3,
		SpeakerUsername:      p.Username,
		SpeakerGender:        p.Sex,
		ForvoPronunciationID: strconv.Itoa(p.ID),
	}
}
