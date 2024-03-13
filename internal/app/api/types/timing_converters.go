package types

import (
	"sort"

	"github.com/LukeWinikates/japanese-accent/internal/app/vtt"
)

func VTTCuesToTimings(cues []vtt.Cue) []Timing {
	timings := make([]Timing, 0)

	sort.Slice(cues, func(i, j int) bool {
		return cues[i].EndMS < cues[j].EndMS
	})

	for _, seg := range cues {
		timings = append(timings, Timing{
			TimeMS: seg.EndMS,
			Labels: []string{"vtt"},
		})
	}

	return timings
}

func VTTCuesToTimedText(cues []vtt.Cue) []TimedText {
	timedText := make([]TimedText, 0)

	sort.Slice(cues, func(i, j int) bool {
		return cues[i].EndMS < cues[j].EndMS
	})

	for _, seg := range cues {
		timedText = append(timedText, TimedText{
			TimeMS:  seg.EndMS,
			Content: seg.Text,
		})
	}

	return timedText
}
