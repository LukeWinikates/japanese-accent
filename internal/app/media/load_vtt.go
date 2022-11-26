package media

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/vtt"
	"os"
)

func LoadVTTasAdvice(mediaDirectory string, youtubeID string) ([]vtt.Segment, error) {
	vttFile := FindSubtitleFile(mediaDirectory, youtubeID)

	if !vttFile.IsFound {
		return nil, nil
	}
	file, err := os.ReadFile(vttFile.Path)
	if err != nil {
		return nil, err
	}

	segments, err := vtt.ParseSegments(string(file))

	if err != nil {
		return nil, err
	}

	return segments, nil
}
