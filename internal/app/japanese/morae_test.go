package japanese

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/stretchr/testify/assert"
	"testing"
)

var two = 2

var 暑い = database.Word{
	DisplayText: "暑い",
	Furigana:    "あつい",
	AccentMora:  &two,
}

var zero = 0

var 厚い = database.Word{
	DisplayText: "厚い",
	Furigana:    "あつい",
	AccentMora:  &zero,
}

func TestCategory(t *testing.T) {
	assert.Equal(t, 平板, AnalyzeShiki(厚い.AccentMora, Morae(厚い.Furigana)), "they should be equal")
	assert.Equal(t, 中高, AnalyzeShiki(暑い.AccentMora, Morae(暑い.Furigana)), "they should be equal")

}

//
//func TestForvoUrl(t *testing.T) {
//	assert.Equal(t, "https://forvo.com/word/%E6%9A%91%E3%81%84/#ja", 暑い.ForvoURL(), "they should be equal")
//	assert.Equal(t, "https://forvo.com/word/%E5%8E%9A%E3%81%84/#ja", 厚い.ForvoURL(), "they should be equal")
//}

func TestMoraCount(t *testing.T) {
	assert.Equal(t, 3, MoraCount(暑い.Furigana), "they should be equal")
	assert.Equal(t, 3, MoraCount(厚い.Furigana), "they should be equal")
	assert.Equal(t, 2, MoraCount("じしょ"), "they should be equal")
	assert.Equal(t, 4, MoraCount("がっこう"), "they should be equal")
}

func TestMoraeCount(t *testing.T) {
	assert.Equal(t, []string{"じ", "しょ"}, Morae("じしょ"), "they should be equal")
	assert.Equal(t, []string{"が", "っ", "こ", "う"}, Morae("がっこう"), "they should be equal")
	assert.Equal(t, []string{"が", "っ", "こ", "う"}, Morae("がっこう"), "they should be equal")
}

func TestPatternString(t *testing.T) {
	assert.Equal(t, "kll", PatternString(1, 3))
	assert.Equal(t, "lhh", PatternString(0, 3))
	assert.Equal(t, "lklll", PatternString(2, 5))
	assert.Equal(t, "lhhkl", PatternString(4, 5))
}
