package types

type VideoSegmentCreate struct {
	StartMS int    `json:"startMS"`
	EndMS   int    `json:"endMS"`
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

type SegmentEditRequest struct {
	StartMS int    `json:"startMS"`
	EndMS   int    `json:"endMS"`
	Text    string `json:"text"`
	UUID    string `json:"uuid"`
}

type SegmentCreateRequest = VideoSegmentCreate

type BoostCreateRequest struct {
	ClipID string `json:"clipId"`
}
type PlaylistCreateRequest struct {
	Count int `json:"count"`
}

type ActivityCreateRequest struct {
	ClipID       string `json:"clipId"`
	ActivityType string `json:"activityType"`
}

type WordAnalysisRequest struct {
	Text string `json:"text"`
}

type VideoWordLinkCreateRequest struct {
	Word    string `json:"word"`
	VideoID string `json:"videoId"`
}

type ApplicationSettingsChangeRequest struct {
	ForvoAPIKey     *string `json:"forvoApiKey"`
	AudioExportPath *string `json:"audioExportPath"`
}

type ExportCreateRequest struct {
	VideoUUID string `json:"videoUuid"`
}
