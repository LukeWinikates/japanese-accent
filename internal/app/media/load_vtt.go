package media

import (
	"fmt"
	"github.com/LukeWinikates/japanese-accent/internal/app/vtt"
	"os"
	"regexp"
)

var safeYoutubeIDRegex = regexp.MustCompile("^[-0-9A-Za-z]+$")

func LoadVTTCues(mediaDirectory string, youtubeID string) ([]vtt.Cue, error) {
	if !safe(youtubeID) {
		return nil, fmt.Errorf("youtubeID %s looks invalid", youtubeID)
	}
	vttFile := FindSubtitleFile(mediaDirectory, youtubeID)

	if !vttFile.IsFound {
		return nil, nil
	}
	file, err := os.ReadFile(vttFile.Path)
	if err != nil {
		return nil, err
	}

	cues, err := vtt.ParseCues(string(file))

	if err != nil {
		return nil, err
	}

	return cues, nil
}

func safe(youtubeID string) bool {
	return safeYoutubeIDRegex.MatchString(youtubeID)
}
