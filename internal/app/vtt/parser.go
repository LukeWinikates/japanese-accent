package vtt

import (
	"bufio"
	"regexp"
	"strconv"
	"strings"
)

func parseSegmentTime(s string) (int, error) {
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

type Segment struct {
	Start int
	End   int
	Text  string
}

func ParseSegments(fileContent string) ([]Segment, error) {
	segments := make([]Segment, 0)
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

			maybeStart, err := parseSegmentTime(start)
			if err != nil {
				return segments, err
			}
			maybeEnd, err := parseSegmentTime(end)
			if err != nil {
				return segments, err
			}

			segments = append(segments, Segment{
				Start: maybeStart,
				End:   maybeEnd,
			})
			continue
		}
		if len(line) > 0 {
			text := regexp.MustCompile("<.*>").ReplaceAllString(line, "")
			seg := segments[len(segments)-1]
			seg.Text = seg.Text + text
			segments[len(segments)-1] = seg
		}
	}

	return segments, nil
}
