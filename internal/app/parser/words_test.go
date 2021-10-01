package parser

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

var 暑い = Word{
	Text:     "暑い",
	Furigana: "あつい",
	MoraAnalysis: &MoraAnalysis{
		AccentMora: 2,
	},
}

var 厚い = Word{
	Text:     "厚い",
	Furigana: "あつい",
	MoraAnalysis: &MoraAnalysis{
		AccentMora: 0,
	},
}

func TestCategory(t *testing.T) {
	assert.Equal(t, 平板, 厚い.Shiki(), "they should be equal")
	assert.Equal(t, 中高, 暑い.Shiki(), "they should be equal")

}

func TestForvoUrl(t *testing.T) {
	assert.Equal(t, "https://forvo.com/word/%E6%9A%91%E3%81%84/#ja", 暑い.ForvoURL(), "they should be equal")
	assert.Equal(t, "https://forvo.com/word/%E5%8E%9A%E3%81%84/#ja", 厚い.ForvoURL(), "they should be equal")
}

func TestMoraCount(t *testing.T) {
	assert.Equal(t, 3, 暑い.MoraCount(), "they should be equal")
	assert.Equal(t, 3, 厚い.MoraCount(), "they should be equal")
	assert.Equal(t, 2, FuriganaWord("じしょ").MoraCount(), "they should be equal")
	assert.Equal(t, 4, FuriganaWord("がっこう").MoraCount(), "they should be equal")
}

func TestMoraeCount(t *testing.T) {
	assert.Equal(t, []string{"じ", "しょ"}, FuriganaWord("じしょ").Morae(), "they should be equal")
	assert.Equal(t, []string{"が", "っ", "こ", "う"}, FuriganaWord("がっこう").Morae(), "they should be equal")
	assert.Equal(t, []string{"が", "っ", "こ", "う"}, FuriganaWord("がっこう").Morae(), "they should be equal")
}
