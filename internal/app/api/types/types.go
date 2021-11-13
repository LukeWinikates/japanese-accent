package types

import (
	"time"
)

type Highlights struct {
	Videos    []VideoSummary `json:"videos"`
	WordLists []WordList     `json:"wordLists"`
}

type VideoSegment struct {
	Start          int                `json:"start"`
	End            int                `json:"end"`
	Text           string             `json:"text"`
	UUID           string             `json:"uuid"`
	VideoUUID      string             `json:"videoUuid"`
	LastActivityAt time.Time          `json:"lastActivityAt"`
	Pitch          *VideoSegmentPitch `json:"pitch"`
}

type VideoSegmentPitch struct {
	Pattern string `json:"pattern"`
	Morae   string `json:"morae"`
}

type VideoSegmentCreate struct {
	Start   int    `json:"start"`
	End     int    `json:"end"`
	Text    string `json:"text"`
	VideoID string `json:"videoUuid"`
}

type VideoCreate struct {
	YoutubeID string `json:"youtubeId"`
	Title     string `json:"title"`
}
type VideoEdit struct {
	Title string `json:"title"`
	Text  string `json:"text"`
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
	Text           string         `json:"text"`
}

type Word struct {
	Text       string   `json:"word"`
	Furigana   string   `json:"furigana"`
	AccentMora *int     `json:"accentMora"`
	MoraCount  int      `json:"moraCount"`
	Shiki      string   `json:"shiki"`
	Morae      []string `json:"morae"`
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

type WordList struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Words []Word `json:"words"`
}

type AudioLinks struct {
	URL                  string `json:"url"`
	SpeakerUsername      string `json:"speakerUsername"`
	SpeakerGender        string `json:"speakerGender"`
	ForvoPronunciationID string `json:"ForvoPronunciationId"`
}

type WordAnalysisRequest struct {
	Text string `json:"text"`
}

type WordAnalysis struct {
	Text     string       `json:"text"`
	Pattern  string       `json:"pattern"`
	Morae    string       `json:"morae"`
	Audio    []AudioLinks `json:"audio"`
	Furigana string       `json:"furigana"`
}

type VideoWordLinkCreateRequest struct {
	Word    string `json:"word"`
	VideoID string `json:"videoId"`
}
