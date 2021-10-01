package handlers

import (
	"fmt"
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database/queries"
	"github.com/LukeWinikates/japanese-accent/internal/app/parser"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"io/ioutil"
	"log"
	"strings"
)

func MakeHandleCategoriesGET(wordsFilePath string, db gorm.DB) func(ctx *gin.Context) {
	return func(context *gin.Context) {

		content, err := ioutil.ReadFile(wordsFilePath)
		if err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		wordlist, err := parser.Parse(string(content))

		if err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		videos, err := queries.RecentlyActiveVideos(db, 5)
		if err != nil {
			if err != nil {
				context.Status(500)
				log.Printf("Error: %s\n", err.Error())
				return
			}
		}

		context.JSON(200, types.CategoriesListResponse{
			Categories: wordlist.Categories,
			Media:      MakeApiVideoSummaries(*videos),
		})
	}
}

func makeApiWord(word parser.Word) types.Word {
	fmt.Printf("%s: %v\n", word.Text, word.MoraCount())
	fmt.Printf("%s: %s\n", word.Text, word.Morae())
	var accentMora *int
	if word.MoraAnalysis != nil {
		accentMora = &word.MoraAnalysis.AccentMora
	}
	return types.Word{
		Text:       word.Text,
		Furigana:   word.Furigana,
		AccentMora: accentMora,
		MoraCount:  word.MoraCount(),
		Morae:      word.Morae(),
		Link:       word.ForvoURL(),
		Shiki:      string(word.Shiki()),
	}
}

func MakeHandleCategoryGET(wordsFilePath string) gin.HandlerFunc {
	return func(context *gin.Context) {

		content, err := ioutil.ReadFile(wordsFilePath)
		if err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		wordlist, err := parser.Parse(string(content))

		if err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		categoryParam := strings.ReplaceAll(context.Params.ByName("category"), "/", "")
		for _, category := range wordlist.Categories {
			if strings.ReplaceAll(category.Name, "#", "") == categoryParam {
				categoryJSON := types.Category{
					Name:  category.Name,
					Words: apiWords(category.Words),
				}
				context.JSON(200, categoryJSON)
				return
			}
		}

		context.Status(404)
	}
}

func apiWords(words []parser.Word) []types.Word {
	apiWords := make([]types.Word, 0)
	for _, w := range words {
		apiWords = append(apiWords, makeApiWord(w))
	}
	return apiWords
}
