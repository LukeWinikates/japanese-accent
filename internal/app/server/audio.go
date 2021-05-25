package server

import (
	"bufio"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"log"
	"regexp"
	"strings"
)

func MakeAudioGET(mediaDirectory string) gin.HandlerFunc {
	return func(context *gin.Context) {
		context.File(mediaDirectory + "/" + context.Param("id") + ".m4a")
	}
}

func MakeAudioSegmentsGET(mediaDirectory string) gin.HandlerFunc {

	return func(context *gin.Context) {
		segmentsFile, err := ioutil.ReadFile(mediaDirectory + "/" + context.Param("id") + ".ja.vtt")
		segments, err := parseSegments(string(segmentsFile))

		if err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		context.JSON(200, segments)

	}
}

type Segment struct {
	Start string `json:"start"`
	End   string `json:"end"`
	Text  string `json:"text"`
}

func parseSegments(fileContent string) ([]Segment, error) {
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

			segments = append(segments, Segment{
				Start: start,
				End:   end,
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

	log.Printf("segments: %s\n", len(segments))

	return segments, nil
}
