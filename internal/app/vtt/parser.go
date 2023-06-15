package vtt

import (
	"bufio"
	"regexp"
	"strconv"
	"strings"
)

type Cue struct {
	StartMS int
	EndMS   int
	Text    string
}

func ParseCues(fileContent string) ([]Cue, error) {
	cues := make([]Cue, 0)
	scanner := bufio.NewScanner(strings.NewReader(fileContent))
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if strings.HasPrefix(line, "WEBVTT") ||
			strings.HasPrefix(line, "Language") ||
			len(line) == 0 ||
			strings.HasPrefix(line, "Kind") {
			continue
		}
		if strings.HasPrefix(line, "00") {
			splits := strings.Split(line, " ")
			start := splits[0]
			end := splits[2]

			maybeStart, err := parseCueTime(start)
			if err != nil {
				return cues, err
			}
			maybeEnd, err := parseCueTime(end)
			if err != nil {
				return cues, err
			}

			cues = append(cues, Cue{
				StartMS: maybeStart,
				EndMS:   maybeEnd,
			})
			continue
		}
		if len(line) > 0 {
			text := regexp.MustCompile("<.*>").ReplaceAllString(line, "")
			seg := cues[len(cues)-1]
			seg.Text = seg.Text + text
			cues[len(cues)-1] = seg
		}
	}

	return cues, nil
}

func parseCueTime(s string) (int, error) {
	mills := strings.Split(s, ".")
	ms, err := strconv.Atoi(mills[1])
	if err != nil {
		return 0, err
	}
	rest := strings.Split(mills[0], ":")
	hr, err := strconv.Atoi(rest[0])
	if err != nil {
		return 0, err
	}
	min, err := strconv.Atoi(rest[1])
	if err != nil {
		return 0, err
	}
	sec, err := strconv.Atoi(rest[2])
	if err != nil {
		return 0, err
	}

	return ms + (1000 * sec) + (min * 60 * 1000) + (hr * 60 * 60 * 1000), nil
}
