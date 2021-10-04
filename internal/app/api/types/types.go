package types

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/parser"
	"time"
)

type Highlights struct {
	Videos []VideoSummary `json:"videos"`
}

type VideoSegment struct {
	Start          int       `json:"start"`
	End            int       `json:"end"`
	Text           string    `json:"text"`
	UUID           string    `json:"uuid"`
	VideoUUID      string    `json:"videoUuid"`
	LastActivityAt time.Time `json:"lastActivityAt"`
}

type VideoSegmentCreate struct {
	Start   int    `json:"start"`
	End     int    `json:"end"`
	Text    string `json:"text"`
	VideoID string `json:"videoUuid"`
}

type VideoCreate struct {
	URL   string `json:"url"`
	Title string `json:"title"`
}

type VideoSummary struct {
	Title          string    `json:"title"`
	URL            string    `json:"url"`
	VideoID        string    `json:"videoId"`
	VideoStatus    string    `json:"videoStatus"`
	LastActivityAt time.Time `json:"lastActivityAt"`
}

type Video struct {
	Title          string         `json:"title"`
	URL            string         `json:"url"`
	VideoID        string         `json:"videoId"`
	VideoStatus    string         `json:"videoStatus"`
	Segments       []VideoSegment `json:"segments"`
	LastActivityAt time.Time      `json:"lastActivityAt"`
}

type Word struct {
	Text       string   `json:"word"`
	Furigana   string   `json:"furigana"`
	AccentMora *int     `json:"accentMora"`
	MoraCount  int      `json:"moraCount"`
	Shiki      string   `json:"shiki"`
	Morae      []string `json:"morae"`
	Link       string   `json:"link"`
}

type Category struct {
	Name  string `json:"name"`
	Tag   string
	Notes string
	Words []Word `json:"words"`
}

type Playlist struct {
	//URL string `json:"url"`
	ID       string         `json:"id"`
	Segments []VideoSegment `json:"segments"`
}

type CategoriesListResponse struct {
	Categories []parser.Category `json:"categories"`
	Media      []VideoSummary    `json:"media"`
}

type SegmentEditRequest struct {
	Start int    `json:"start"`
	End   int    `json:"end"`
	Text  string `json:"text"`
	UUID  string `json:"uuid"`
}

type SegmentCreateRequest = VideoSegmentCreate

type BoostCreateRequest struct {
	SegmentID string `json:"segmentId"`
}
type PlaylistCreateRequest struct {
	Count int `json:"count"`
}

type ActivityCreateRequest struct {
	SegmentID    string `json:"segmentId"`
	ActivityType string `json:"activityType"`
}
