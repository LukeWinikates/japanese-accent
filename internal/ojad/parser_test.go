package ojad

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"strings"
	"testing"
)

var testString = `
<div class="phrasing_text">
    <span class="accent_top mola_0">
        <span class="inner">
        <span class="char">め</span>
    </span>
    </span>
    <span class="mola_1"><span class="inner">
        <span class="char">が</span></span></span>
    <span class="mola_2"><span class="inner">
        <span class="char">い</span></span></span>
    <span class="accent_top mola_3"><span class="inner">
        <span class="char">た</span>
    </span></span>
    <span class="mola_4">
        <span class="inner">
        <span class="char">い</span>
        </span>
    </span>
    <span class="inner endspace">
        <span class="char"></span>
    </span>
</div>
`

func TestParsing(t *testing.T) {
	parse, err := Parse(strings.NewReader(testString))
	if err != nil {
		t.Error("err was supposed to be nil")
		t.Error(err.Error())
	}

	assert.Equal(t, 1, len(parse), nil)
	assert.Equal(t, 5, len(parse[0].Morae), nil)
	expected := []PitchedMora{{
		Mora:    "め",
		HighLow: "kernel",
	}, {
		Mora:    "が",
		HighLow: "low",
	}, {
		Mora:    "い",
		HighLow: "low",
	}, {
		Mora:    "た",
		HighLow: "kernel",
	}, {
		Mora:    "い",
		HighLow: "low",
	},
	}
	assert.Equal(t, expected, parse[0].Morae, nil)
}

func TestClient(t *testing.T) {
	pitches, err := GetPitches("ありが　すいかを　みつけて　やってきました")
	if err != nil {
		t.Error("err was supposed to be nil")
		t.Error(err.Error())
	}
	fmt.Println(pitches)
}
