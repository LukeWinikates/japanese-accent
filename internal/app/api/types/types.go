package types

import (
	"time"
)

type Highlights struct {
	Videos    []VideoSummary `json:"videos"`
	WordLists []WordList     `json:"wordLists"`
}

type Clip struct {
	StartMS        int        `json:"startMS"`
	EndMS          int        `json:"endMS"`
	Text           string     `json:"text"`
	UUID           string     `json:"uuid"`
	VideoUUID      string     `json:"videoUuid"`
	LastActivityAt time.Time  `json:"lastActivityAt"`
	Pitch          *ClipPitch `json:"pitch"`
	Priority       int        `json:"priority"`
	Labels         []string   `json:"labels"`
	ParentUUID     *string    `json:"parent"`
}

type ClipPitch struct {
	Pattern string `json:"pattern"`
	Morae   string `json:"morae"`
}

type VideoSummary struct {
	Title          string    `json:"title"`
	URL            string    `json:"url"`
	VideoID        string    `json:"videoId"`
	LastActivityAt time.Time `json:"lastActivityAt"`
}

type Files struct {
	HasMediaFile    bool `json:"hasMediaFile"`
	HasSubtitleFile bool `json:"hasSubtitleFile"`
}

type Video struct {
	Title          string    `json:"title"`
	URL            string    `json:"url"`
	VideoID        string    `json:"videoId"`
	Files          Files     `json:"files"`
	Clips          []Clip    `json:"clips"`
	LastActivityAt time.Time `json:"lastActivityAt"`
	Text           string    `json:"text"`
	Words          []Word    `json:"words"`
	Status         string    `json:"status"`
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
	ID    string `json:"id"`
	Clips []Clip `json:"clips"`
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

type WordAnalysis struct {
	Text     string      `json:"text"`
	Pattern  string      `json:"pattern"`
	Morae    string      `json:"morae"`
	Audio    []AudioLink `json:"audio"`
	Furigana string      `json:"furigana"`
}

type ApplicationSettings struct {
	ForvoAPIKey     *string `json:"forvoApiKey"`
	AudioExportPath *string `json:"audioExportPath"`
}

type ExportCreateResponse struct {
	ID string `json:"id"`
}

type ExportGetResponse struct {
	ID       string `json:"id"`
	Progress string `json:"progress"`
	Done     bool   `json:"done"`
}

type Timing struct {
	TimeMS int      `json:"timeMS"`
	Labels []string `json:"labels"`
}

type TimedText struct {
	Content string `json:"content"`
	TimeMS  int    `json:"timeMS"`
}

type VideoAdviceResponse struct {
	SuggestedClips []SuggestedClip `json:"suggestedClips"`
	TextSnippets   []TimedText     `json:"textSnippets"`
}

type SuggestedClip struct {
	StartMS   int      `json:"startMS"`
	EndMS     int      `json:"endMS"`
	Text      string   `json:"text"`
	UUID      string   `json:"uuid"`
	Labels    []string `json:"labels"`
	VideoUUID string   `json:"videoUuid"`
}

type ErrorResponse struct {
	Message string `json:"message"`
}
