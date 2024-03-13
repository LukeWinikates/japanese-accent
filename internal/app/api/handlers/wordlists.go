package handlers

import (
	"log"

	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/database/queries"
	"github.com/LukeWinikates/japanese-accent/internal/app/japanese"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func MakeWordListListGET(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		wordLists, err := queries.RecentlyActiveWordLists(db, 30)

		if err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		apiVideos := MakeApiWordLists(*wordLists)

		context.JSON(200, apiVideos)
	}
}

func MakeApiWordLists(lists []database.WordList) []types.WordList {
	apiList := make([]types.WordList, 0)
	for _, list := range lists {
		apiList = append(apiList, MakeApiWordList(list))
	}
	return apiList
}

func MakeApiWordList(list database.WordList) types.WordList {
	return types.WordList{
		ID:    list.ID,
		Name:  list.Name,
		Words: MakeApiWords(list.Words),
	}
}

func MakeApiWords(words []database.Word) []types.Word {
	apiWords := make([]types.Word, 0)
	for _, word := range words {
		apiWords = append(apiWords, MakeAPIWord(word))
	}
	return apiWords
}

func MakeAPIWord(word database.Word) types.Word {
	morae := japanese.Morae(word.Furigana)
	return types.Word{
		Text:       word.DisplayText,
		Furigana:   word.Furigana,
		AccentMora: word.AccentMora,
		MoraCount:  len(morae),
		Shiki:      string(japanese.AnalyzeShiki(word.AccentMora, morae)),
		Morae:      morae,
		Audio:      make([]types.AudioLink, 0),
	}
}

func MakeWordListGET(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var wordList *database.WordList

		id := context.Param("id")
		if err := db.Preload("Words").Where("id = ?", id).First(&wordList).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		apiWordList := MakeApiWordList(*wordList)

		context.JSON(200, apiWordList)
	}
}
