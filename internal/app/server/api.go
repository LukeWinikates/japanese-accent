package server

import "github.com/LukeWinikates/japanese-accent/internal/app/parser"

type ApiHighlights struct {
	Videos []ApiVideo `json:"videos"`
}

type ApiVideoSegment struct {
	Start int    `json:"start"`
	End   int    `json:"end"`
	Text  string `json:"text"`
	UUID  string `json:"uuid"`
}

type ApiVideoSegmentCreate struct {
	Start   int    `json:"start"`
	End     int    `json:"end"`
	Text    string `json:"text"`
	VideoID string `json:"videoId"`
}

type ApiVideo struct {
	Title   string `json:"title"`
	URL     string `json:"url"`
	VideoID string `json:"videoId"`
}

type ApiWord struct {
	Text       string   `json:"word"`
	Furigana   string   `json:"furigana"`
	AccentMora *int     `json:"accentMora"`
	MoraCount  int      `json:"moraCount"`
	Shiki      string   `json:"shiki"`
	Morae      []string `json:"morae"`
	Link       string   `json:"link"`
}

type ApiCategory struct {
	Name  string `json:"name"`
	Tag   string
	Notes string
	Words []ApiWord `json:"words"`
}

type CategoriesListResponse struct {
	Categories []parser.Category `json:"categories"`
	Media      []ApiVideo        `json:"media"`
}
