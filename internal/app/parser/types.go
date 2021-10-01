package parser

import "strings"

type Link struct {
	Text string
	URL  string
}

func (link Link) VideoID() string {
	return strings.Split(link.URL, "=")[1]
}

type Category struct {
	Name       string `json:"name"`
	Tag        string
	Notes      string
	Words      []Word
	Categories []Category `json:"categories"`
}

type WordList struct {
	Categories []Category
	Media      []Link
}
