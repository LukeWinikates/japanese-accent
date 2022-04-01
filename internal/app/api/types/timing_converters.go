package types

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/vtt"
	"sort"
)

func VTTSegmentsToTimings(segments []vtt.Segment) []Timing {
	timings := make([]Timing, 0)

	sort.Slice(segments, func(i, j int) bool {
		return segments[i].EndMS < segments[j].EndMS
	})

	for _, seg := range segments {
		timings = append(timings, Timing{
			TimeMS: seg.EndMS,
			Labels: []string{"vtt"},
		})
	}

	return timings
}

func VTTSegmentsToTimedText(segments []vtt.Segment) []TimedText {
	timedText := make([]TimedText, 0)

	sort.Slice(segments, func(i, j int) bool {
		return segments[i].EndMS < segments[j].EndMS
	})

	for _, seg := range segments {
		timedText = append(timedText, TimedText{
			TimeMS:  seg.EndMS,
			Content: seg.Text,
		})
	}

	return timedText
}
