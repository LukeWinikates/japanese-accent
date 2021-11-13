package japanese

import "strings"

func MoraCount(furigana string) int {
	count := 0
	for _, r := range furigana {
		switch r {
		case []rune("ょ")[0]:
		case []rune("ゃ")[0]:
		case []rune("ゅ")[0]:
		default:
			count++
		}
	}
	return count
}

func Morae(furigana string) []string {
	morae := make([]string, 0)
	for _, r := range furigana {
		ji := string(r)
		if isGlide(r) {
			morae = append(morae[0:len(morae)-1], morae[len(morae)-1]+ji)
		} else {
			morae = append(morae, ji)
		}
	}
	return morae
}

func isGlide(r rune) bool {
	switch r {
	case []rune("ょ")[0]:
		return true
	case []rune("ゃ")[0]:
		return true
	case []rune("ゅ")[0]:
		return true
	default:
	}
	return false
}

type Shiki string

const (
	平板 = Shiki("平板")
	頭高 = Shiki("頭高")
	中高 = Shiki("中高")
	尾高 = Shiki("尾高")
	未定 = Shiki("未定")
)

func AnalyzeShiki(accentMora *int, morae []string) Shiki {
	if accentMora == nil {
		return 未定
	}
	switch *accentMora {
	case 0:
		return 平板
	case 1:
		return 頭高
	case len(morae):
		return 尾高
	default:
	}
	return 中高
}

func PatternString(accentMora int, wordLength int) string {
	value := ""
	if accentMora == 0 {
		value += "l"
		for i := 1; i < wordLength; i++ {
			value += "h"
		}
		return value
	}

	if accentMora == 1 {
		value += "k"
		for i := 1; i < wordLength; i++ {
			value += "l"
		}
		return value
	}

	value += "l"

	for i := 1; i < wordLength; i++ {
		if i+1 < accentMora {
			value += "h"
			continue
		}
		if i+1 == accentMora {
			value += "k"
			continue
		}
		value += "l"
	}
	return value
}

func AccentedMoraFromPattern(pattern string) int {
	return strings.Index(pattern, "k") + 1
}
