package vtt

import (
	"crypto/sha256"
	"encoding/base64"
	"fmt"
)

func Sha(t Cue) string {
	shaHasher := sha256.New()
	shaHasher.Write([]byte(fmt.Sprintf("%v %v %s", t.StartMS, t.EndMS, t.Text)))
	return base64.URLEncoding.EncodeToString(shaHasher.Sum(nil))
}
