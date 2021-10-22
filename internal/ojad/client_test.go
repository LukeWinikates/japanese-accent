// +build integration

package ojad

import (
	"fmt"
	"testing"
)

func TestClient(t *testing.T) {
	pitches, err := GetPitches("ありが　すいかを　みつけて　やってきました")
	if err != nil {
		t.Error("err was supposed to be nil")
		t.Error(err.Error())
	}
	fmt.Println(pitches)
}

func TestClientWithCommaPhrase(t *testing.T) {
	pitches, err := GetPitches("いたいた、とらちゃん")
	if err != nil {
		t.Error("err was supposed to be nil")
		t.Error(err.Error())
	}

	fmt.Println(pitches)
}

func TestClientWithYooonPhrase(t *testing.T) {
	pitches, err := GetPitches("けんきゅう")
	if err != nil {
		t.Error("err was supposed to be nil")
		t.Error(err.Error())
	}

	fmt.Println(pitches)
}
