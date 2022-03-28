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
	Priority       int                `json:"priority"`
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

type Files struct {
	HasMediaFile    bool `json:"hasMediaFile"`
	HasSubtitleFile bool `json:"hasSubtitleFile"`
}

type Video struct {
	Title          string         `json:"title"`
	URL            string         `json:"url"`
	VideoID        string         `json:"videoId"`
	VideoStatus    string         `json:"videoStatus"`
	Files          Files          `json:"files"`
	Segments       []VideoSegment `json:"segments"`
	LastActivityAt time.Time      `json:"lastActivityAt"`
	Text           string         `json:"text"`
	Words          []Word         `json:"words"`
	Status         string         `json:"status"`
}

type VttSegment struct {
	Start int    `json:"start"`
	End   int    `json:"end"`
	Text  string `json:"text"`
}

type VttTimeline struct {
	Segments    []VttSegment `json:"segments"`
	DurationSec int          `json:"durationSec"`
}

type Word struct {
	Text       string      `json:"word"`
	Furigana   string      `json:"furigana"`
	AccentMora *int        `json:"accentMora"`
	MoraCount  int         `json:"moraCount"`
	Shiki      string      `json:"shiki"`
	Morae      []string    `json:"morae"`
	Audio      []AudioLink `json:"audio"`
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

type AudioLink struct {
	URL                  string `json:"url"`
	SpeakerUsername      string `json:"speakerUsername"`
	SpeakerGender        string `json:"speakerGender"`
	ForvoPronunciationID string `json:"ForvoPronunciationId"`
}

type WordAnalysisRequest struct {
	Text string `json:"text"`
}

type WordAnalysis struct {
	Text     string      `json:"text"`
	Pattern  string      `json:"pattern"`
	Morae    string      `json:"morae"`
	Audio    []AudioLink `json:"audio"`
	Furigana string      `json:"furigana"`
}

type VideoWordLinkCreateRequest struct {
	Word    string `json:"word"`
	VideoID string `json:"videoId"`
}

type ApplicationSettings struct {
	ForvoAPIKey     *string `json:"forvoApiKey"`
	AudioExportPath *string `json:"audioExportPath"`
}

type ApplicationSettingsChangeRequest struct {
	ForvoAPIKey     *string `json:"forvoApiKey"`
	AudioExportPath *string `json:"audioExportPath"`
}

type ExportCreateRequest struct {
	VideoUUID string `json:"videoUuid"`
}

type ExportCreateResponse struct {
	ID string `json:"id"`
}
