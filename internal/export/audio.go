package export

import (
	"fmt"
	ffmpeg "github.com/u2takey/ffmpeg-go"
	"os"
	"strconv"
)

type RecipeSegment struct {
	Name  string
	Start int
	End   int
}

type Progress struct {
	CurrentSegment int
	Total          int
	Ended          bool
	Error          error
}

type Recipe struct {
	FilePath        string
	Title           string
	DestinationPath string
	Segments        []RecipeSegment
}

func newProgress(recipe Recipe) *Progress {
	return &Progress{
		CurrentSegment: 0,
		Total:          len(recipe.Segments),
		Ended:          false,
		Error:          nil,
	}
}

func (progress *Progress) setError(err error) Progress {
	progress.Error = err
	progress.Ended = true
	return *progress
}

func (progress *Progress) setCurrent(current int) Progress {
	progress.CurrentSegment = current
	return *progress
}

func (progress *Progress) finished() Progress {
	progress.CurrentSegment = progress.Total
	progress.Ended = true
	return *progress
}

func (progress *Progress) Describe() string {
	if progress.Error != nil {
		return fmt.Sprintf("Error: %v segment: %v)",
			progress.Error.Error(), progress.CurrentSegment)

	}
	return fmt.Sprintf("%d%% (%d/%d).",
		(100*progress.CurrentSegment)/progress.Total, progress.CurrentSegment, progress.Total)
}

func WriteToPath(recipe Recipe, watcher chan Progress) error {
	defer close(watcher)

	fmt.Println(os.Mkdir(recipe.DestinationPath, 0750))

	progress := newProgress(recipe)
	for i, segment := range recipe.Segments {
		segmentNo := i + 1
		watcher <- progress.setCurrent(segmentNo)
		streams := make([]*ffmpeg.Stream, 0)
		for i := 0; i < 3; i++ {
			streams = append(streams, ffmpeg.Input(recipe.FilePath, ffmpeg.KwArgs{
				"ss": strconv.Itoa(segment.Start) + "ms",
				"t":  strconv.Itoa(segment.End-segment.Start) + "ms",
			}))
			silenceDuration := ((segment.End - segment.Start) * 12) / 10
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
		).Output(fileName(recipe, segmentNo, segment), ffmpeg.KwArgs{
			"metadata": []string{
				fmt.Sprintf("title=%s", segment.Name),
				fmt.Sprintf("album=%s", recipe.Title),
				fmt.Sprintf("track=%v", segmentNo),
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

func fileName(recipe Recipe, segmentNo int, segment RecipeSegment) string {
	return fmt.Sprintf("%s/%03d-%s.m4a", recipe.DestinationPath, segmentNo, segment.Name)
}
