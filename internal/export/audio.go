package export

import (
	"fmt"
	"os"
	"strconv"

	ffmpeg "github.com/u2takey/ffmpeg-go"
)

type RecipeClip struct {
	Name  string
	Start int
	End   int
}

type Progress struct {
	CurrentClip int
	Total       int
	Ended       bool
	Error       error
}

type Recipe struct {
	FilePath        string
	Title           string
	DestinationPath string
	Clips           []RecipeClip
}

func newProgress(recipe Recipe) *Progress {
	return &Progress{
		CurrentClip: 0,
		Total:       len(recipe.Clips),
		Ended:       false,
		Error:       nil,
	}
}

func (progress *Progress) setError(err error) Progress {
	progress.Error = err
	progress.Ended = true
	return *progress
}

func (progress *Progress) setCurrent(current int) Progress {
	progress.CurrentClip = current
	return *progress
}

func (progress *Progress) finished() Progress {
	progress.CurrentClip = progress.Total
	progress.Ended = true
	return *progress
}

func (progress *Progress) Describe() string {
	if progress.Error != nil {
		return fmt.Sprintf("Error: %v clip: %v)",
			progress.Error.Error(), progress.CurrentClip)

	}
	return fmt.Sprintf("%d%% (%d/%d).",
		(100*progress.CurrentClip)/progress.Total, progress.CurrentClip, progress.Total)
}

func WriteToPath(recipe Recipe, watcher chan Progress) error {
	defer close(watcher)

	fmt.Println(os.Mkdir(recipe.DestinationPath, 0750))

	progress := newProgress(recipe)
	for i, recipeClip := range recipe.Clips {
		clipNo := i + 1
		watcher <- progress.setCurrent(clipNo)
		streams := make([]*ffmpeg.Stream, 0)
		for i := 0; i < 3; i++ {
			streams = append(streams, ffmpeg.Input(recipe.FilePath, ffmpeg.KwArgs{
				"ss": strconv.Itoa(recipeClip.Start) + "ms",
				"t":  strconv.Itoa(recipeClip.End-recipeClip.Start) + "ms",
			}))
			silenceDuration := ((recipeClip.End - recipeClip.Start) * 12) / 10
			streams = append(streams,
				ffmpeg.Input(
					fmt.Sprintf("anullsrc=duration=%sms",
						strconv.Itoa(silenceDuration)),
					ffmpeg.KwArgs{
						"f": "lavfi",
					}).Audio())
		}
		err := ffmpeg.Concat(streams, ffmpeg.KwArgs{
			"a": 1,
			"v": 0,
		}).Filter(
			"loudnorm",
			ffmpeg.Args{},
			ffmpeg.KwArgs{
				"i": "-5.0",
			},
		).Output(fileName(recipe, clipNo, recipeClip), ffmpeg.KwArgs{
			"metadata": []string{
				fmt.Sprintf("title=%s", recipeClip.Name),
				fmt.Sprintf("album=%s", recipe.Title),
				fmt.Sprintf("track=%v", clipNo),
				fmt.Sprintf("artist=%s", "Japanese Accent Practice"),
			},
		}).
			OverWriteOutput().
			ErrorToStdOut().
			Run()
		if err != nil {
			watcher <- progress.setError(err)
			return err
		}
	}

	watcher <- progress.finished()
	return nil
}

func fileName(recipe Recipe, clipNum int, clip RecipeClip) string {
	return fmt.Sprintf("%s/%03d-%s.m4a", recipe.DestinationPath, clipNum, clip.Name)
}
