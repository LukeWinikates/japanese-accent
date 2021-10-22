package ojad

import (
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

var testStringWithComma = `
<div class="phrasing_phrase_wrapper">
  <div class="phrasing_accent_curve">
    <canvas id="#phrase_0_0" width="60" height="100"></canvas>
  </div>

  <div class="phrasing_text">
    <span class="accent_top mola_0">
      <span class="inner"><span class="char">な</span></span>
    </span>
    <span class="mola_1">
      <span class="inner"><span class="char">ん</span></span>
    </span>
    <span class="mola_2">
      <span class="inner"><span class="char">だ</span></span>
    </span>
    <span class="inner endmark"><span class="char">、</span></span>
  </div>

  <div class="phrasing_subscript">
    <span>なんだ</span><span class="inner endmark"><span class="char">、</span></span>
  </div>
</div>
<div class="phrasing_phrase_wrapper">
  <div class="phrasing_accent_curve">
    <canvas id="#phrase_0_1" width="180" height="100"></canvas>
  </div>

  <script type="text/javascript">
    $(function () {
      set_accent_curve_phrase("#phrase_0_1", 9, [0, 1, 0, 0, 0, 2, 2, 2, 2], 1, 1, 0);
    });
  </script>

  <div class="phrasing_text">
    <span class="mola_0">
      <span class="inner"><span class="char">い</span></span>
    </span>
    <span class="accent_top mola_1">
      <span class="inner"><span class="char">た</span></span>
    </span>
    <span class="mola_2">
      <span class="inner"><span class="char">い</span></span>
    </span>
    <span class="mola_3">
      <span class="inner"><span class="char">た</span></span>
    </span>
    <span class="mola_4">
      <span class="inner"><span class="char">あ</span></span>
    </span>
    <span class="accent_plain mola_5">
      <span class="inner"><span class="char">の</span></span>
    </span>
    <span class="accent_plain mola_6">
      <span class="inner"><span class="char">セ</span></span>
    </span>
    <span class="accent_plain mola_7">
      <span class="inner"><span class="char">ビ</span></span>
    </span>
    <span class="accent_plain mola_8">
      <span class="inner"><span class="char">ロ</span></span>
    </span>
    <span class="inner endspace"><span class="char"></span></span>
  </div>

  <div class="phrasing_subscript">
    <span>いたいたあのせびろ</span><span class="inner endspace"><span class="char"></span></span>
  </div>
</div>
`

var testStringWithGlide = `
<div class="phrasing_accent_curve">
  <canvas id="#phrase_0_0" width="100" height="100"></canvas>
</div>

<script type="text/javascript">
  $(function () {
    set_accent_curve_phrase("#phrase_0_0", 5, [0, 1, 1, 1, 1], 1, 0, 0);
  });
</script>

<div class="phrasing_text">
  <span class="mola_0">
    <span class="inner"><span class="char">け</span></span>
  </span>
  <span class="accent_plain mola_1">
    <span class="inner"><span class="char">ん</span></span>
  </span>
  <span class="accent_plain mola_2">
    <span class="inner"><span class="char">き</span><span class="char">ゅ</span></span>
  </span>
  <span class="accent_plain mola_3">
    <span class="inner"><span class="char">う</span></span>
  </span>
  <span class="inner endspace"><span class="char"></span></span>
</div>

<div class="phrasing_subscript">
  <span>けんきゅう</span><span class="inner endspace"><span class="char"></span></span>
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

func TestParseWithCommas(t *testing.T) {
	parse, err := Parse(strings.NewReader(testStringWithComma))
	if err != nil {
		t.Error("err was supposed to be nil")
		t.Error(err.Error())
	}

	assert.Equal(t, 2, len(parse), nil)
	assert.Equal(t, 3, len(parse[0].Morae), nil)
	assert.Equal(t, 9, len(parse[1].Morae), nil)
	expected0 := []PitchedMora{{
		Mora:    "な",
		HighLow: "kernel",
	}, {
		Mora:    "ん",
		HighLow: "low",
	}, {
		Mora:    "だ",
		HighLow: "low",
	},
	}
	expected1 := []PitchedMora{{
		Mora:    "い",
		HighLow: "low",
	}, {
		Mora:    "た",
		HighLow: "kernel",
	}, {
		Mora:    "い",
		HighLow: "low",
	}, {
		Mora:    "た",
		HighLow: "low",
	}, {
		Mora:    "あ",
		HighLow: "low",
	}, {
		Mora:    "の",
		HighLow: "high",
	}, {
		Mora:    "セ",
		HighLow: "high",
	}, {
		Mora:    "ビ",
		HighLow: "high",
	}, {
		Mora:    "ロ",
		HighLow: "high",
	},
	}
	assert.Equal(t, expected0, parse[0].Morae, nil)
	assert.Equal(t, expected1, parse[1].Morae, nil)
}

func TestParseWithGlides(t *testing.T) {
	parse, err := Parse(strings.NewReader(testStringWithGlide))
	if err != nil {
		t.Error("err was supposed to be nil")
		t.Error(err.Error())
	}

	assert.Equal(t, 1, len(parse), nil)
	assert.Equal(t, 4, len(parse[0].Morae), nil)
	expected0 := []PitchedMora{
		{Mora:"け", HighLow:"low"},
		{Mora:"ん", HighLow:"high"},
		{Mora:"きゅ", HighLow:"high"},
		{Mora:"う", HighLow:"high"},
	}

	assert.Equal(t, expected0, parse[0].Morae, nil)
}
