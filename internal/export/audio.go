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

type Recipe struct {
	FilePath        string
	Title           string
	DestinationPath string
	Segments        []RecipeSegment
}

func WriteToPath(recipe Recipe) error {
	fmt.Println(os.Mkdir(recipe.DestinationPath, 0750))
	// since we know the number of segments, we could write status updates back to a channel here
	for segmentNo, segment := range recipe.Segments {
		streams := make([]*ffmpeg.Stream, 0)
		for i := 0; i < 2; i++ {
			streams = append(streams, ffmpeg.Input(recipe.FilePath, ffmpeg.KwArgs{
				"ss": strconv.Itoa(segment.Start) + "ms",
				"t":  strconv.Itoa(segment.End-segment.Start) + "ms",
			}))
			silenceDuration := (segment.End - segment.Start) * 2
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
		}).Output(recipe.DestinationPath+"/"+segment.Name+".mp3", ffmpeg.KwArgs{
			"metadata": []string{
				fmt.Sprintf("title=%s", segment.Name),
				fmt.Sprintf("album=%s", recipe.Title),
				fmt.Sprintf("track=%v", segmentNo+1),
				fmt.Sprintf("artist=%s", "Japanese Accent Practice"),
			},
		}).
			OverWriteOutput().
			ErrorToStdOut().
			Run()
		if err != nil {
			return err
		}
	}

	return nil
}
