package export

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"github.com/u2takey/go-utils/env"
	"os"
	"testing"
)

func TestWriting(t *testing.T) {
	tmp, err := os.MkdirTemp("", "")
	if err != nil {
		t.Error("err was supposed to be nil")
		t.Error(err.Error())
		return
	}

	progresses := make(chan Progress, 2)

	go func() {
		for {
			p := <-progresses
			if p.Ended {
				break
			}
		}
	}()

	err = WriteToPath(Recipe{
		FilePath:        env.GetEnvAsStringOrFallback("PROJECT_DIR", ".") + "/test/test.m4a",
		DestinationPath: tmp,
		Segments: []RecipeSegment{
			{
				Name:  "1",
				Start: 300,
				End:   300 + 200,
			},
			{
				Name:  "2",
				Start: 800,
				End:   800 + 500,
			},
		},
	}, progresses)

	if err != nil {
		t.Error("err was supposed to be nil")
		t.Error(err.Error())
	}

	fmt.Println(tmp)
	assert.FileExists(t, tmp+"/"+"1.mp3")
	assert.FileExists(t, tmp+"/"+"2.mp3")

}
