package server

import (
	"bufio"
	"github.com/LukeWinikates/japanese-accent/internal/app/core"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"io/ioutil"
	"log"
	"regexp"
	"strconv"
	"strings"
)

func MakeAudioGET(mediaDirectory string) gin.HandlerFunc {
	return func(context *gin.Context) {
		context.File(mediaDirectory + "/" + context.Param("id") + ".m4a")
	}
}

func MakeAudioSegmentsGET(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var segmentList *core.SegmentList

		youtubeID := context.Param("id")
		if db.Preload("Segments").Where("youtube_id = ?", youtubeID).First(&segmentList).Error != nil {
			log.Printf("no segment list")

			err := initializeSegments(mediaDirectory, youtubeID, segmentList, db)
			if err != nil {
				context.Status(500)
				log.Printf("Error: %s\n", err.Error())
				return
			}
		}

		log.Printf("segmentList: %v\n", len(segmentList.Segments))
		segments := apiSegments(segmentList)

		context.JSON(200, segments)

	}
}

func apiSegments(list *core.SegmentList) []ApiSegment {
	apiSegs := make([]ApiSegment, 0)

	for _, segment := range list.Segments {
		apiSegs = append(apiSegs, ApiSegment{
			Start: segment.Start,
			End:   segment.End,
			Text:  segment.Text,
		})
	}

	return apiSegs
}

//func MakeAudioSegmentsPOST(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
//
//}

func initializeSegments(mediaDirectory string, youtubeID string, segmentList *core.SegmentList, db gorm.DB) error {
	segmentsFile, err := ioutil.ReadFile(mediaDirectory + "/" + youtubeID + ".ja.vtt")
	segments, err := parseSegments(string(segmentsFile))
	if err != nil {
		return err
	}
	dbSegments := make([]core.Segment, 0)
	for _, segment := range segments {
		start, err := parseSegmentTime(segment.Start)
		if err != nil {
			return err
		}
		end, err := parseSegmentTime(segment.End)
		if err != nil {
			return err
		}
		dbSegments = append(dbSegments, core.Segment{
			Start: start,
			End:   end,
			Text:  segment.Text,
		})
	}
	segmentList = &core.SegmentList{
		YoutubeID: youtubeID,
		Segments:  dbSegments,
	}

	return db.Save(segmentList).Error
}

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
	Start string `json:"start"`
	End   string `json:"end"`
	Text  string `json:"text"`
}

type ApiSegment struct {
	Start int    `json:"start"`
	End   int    `json:"end"`
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
