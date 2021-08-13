package server

type ApiHighlights struct {
	Videos []ApiLink `json:"videos"`
}

type ApiVideoSegment struct {
	Start int    `json:"start"`
	End   int    `json:"end"`
	Text  string `json:"text"`
	UUID  string `json:"uuid"`
}
