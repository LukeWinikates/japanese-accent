package core

import (
	"net/url"
)

type Word struct {
	Text       string `json:"word"`
	Furigana   string `json:"furigana"`
	AccentMora int    `json:"accentMora"`
	moraCount  *int   `json:"moraCount"`
}

type Shiki string

const (
	平板 = Shiki("平板")
	頭高 = Shiki("頭高")
	中高 = Shiki("中高")
	尾高 = Shiki("尾高")
)

func (w Word) Shiki() Shiki {
	switch w.AccentMora {
	case 0:
		return 平板
	case 1:
		return 頭高
	case w.MoraCount():
		return 尾高
	default:
	}
	return 中高
}

func (w Word) MoraCount() int {
	if w.moraCount != nil {
		return *w.moraCount
	}
	count := 0
	for _, r := range w.Furigana {
		switch r {
		case []rune("ょ")[0]:
		case []rune("ゃ")[0]:
		case []rune("ゅ")[0]:
		default:
			count++
		}
	}
	w.moraCount = &count
	return count
}

func (w Word) ForvoURL() string {
	escaped := url.QueryEscape(w.Text)
	return "https://forvo.com/word/" + escaped + "/#ja"
}

func FuriganaWord(kana string) Word {
	return Word{
		Text:     kana,
		Furigana: kana,
	}
}
