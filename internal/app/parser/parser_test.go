package parser

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

const exampleText = `
#ごめんやさい
-https://www.youtube.com/watch?v=8oqTmNnfK5Y (m, very fast)
-https://www.youtube.com/watch?v=ptWrsx2tw1A (f, very animated)

ごめんなさい
なす
なすちゃん
帽子
かぶる
かぶって
お出かけ
こっち
グリグリ
お絵かきしていたら
ゴッツンこ
ひっぱりあいっ子
じゅんばんぬかし
ぬかし
だったのに
ピーマン
大根
やぶけちゃった
ちがうでしょう
ちゃんと言おうね
へっちゃらだや

#とうさん　まいご
ぼく
おもちゃ
研究
靴
雰囲気
背広
ネクタイ
あの
あれれ
どちらでもない
いつのまにか
とうさん
まいご
りっぱすぎ
まっていろよ
`

func TestBasicParsing(t *testing.T) {
	result, err := Parse(exampleText)
	if err != nil {
		t.Error("err was supposed to be nil")
	}
	assert.Equal(t, 2, len(result.Categories), nil)
	section := result.Categories[0]
	assert.Equal(t, "#ごめんやさい", section.Name, nil)

	assert.Equal(t, 2, len(section.Links), nil)
	assert.Equal(t, 21, len(section.Words), nil)

	section = result.Categories[1]
	assert.Equal(t, "#とうさん　まいご", section.Name, nil)

	assert.Equal(t, 0, len(section.Links), nil)
	assert.Equal(t, 15, len(section.Words), nil)
}
