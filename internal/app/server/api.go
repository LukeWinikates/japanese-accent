package server

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/parser"
)

type ApiHighlights struct {
	Videos []ApiVideoSummary `json:"videos"`
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

type ApiVideoCreate struct {
	URL   string `json:"url"`
	Title string `json:"title"`
}

type ApiVideoSummary struct {
	Title       string `json:"title"`
	URL         string `json:"url"`
	VideoID     string `json:"videoId"`
	VideoStatus string `json:"videoStatus"`
}

type ApiVideo struct {
	Title       string            `json:"title"`
	URL         string            `json:"url"`
	VideoID     string            `json:"videoId"`
	VideoStatus string            `json:"videoStatus"`
	Segments    []ApiVideoSegment `json:"segments"`
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
	Media      []ApiVideoSummary `json:"media"`
}

type SegmentEditRequest = ApiVideoSegment

type SegmentCreateRequest = ApiVideoSegmentCreate
