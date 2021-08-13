package server

import (
	"bufio"
	"github.com/LukeWinikates/japanese-accent/internal/app/core"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
		var video *core.Video

		youtubeID := context.Param("id")
		if db.Preload("Segments").Where("youtube_id = ?", youtubeID).First(&video).Error != nil {
			log.Printf("no segment list")

			err := initializeSegments(mediaDirectory, youtubeID, video, db)
			if err != nil {
				context.Status(500)
				log.Printf("Error: %s\n", err.Error())
				return
			}
		}

		log.Printf("video: %v\n", len(video.Segments))
		segments := MakeApiSegments(video)

		context.JSON(200, segments)

	}
}

type SegmentEditRequest = ApiVideoSegment

func MakeAudioSegmentsPOST(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		segmentID := context.Param("id")
		//youtubeID := context.Param("audioId")
		var segmentEditRequest SegmentEditRequest
		if err := context.BindJSON(&segmentEditRequest); err != nil {
			context.Status(500)
		}

		log.Print(segmentEditRequest)

		var segment *core.VideoSegment
		//
		//youtubeID := context.Param("id")
		if err := db.Where("uuid = ? ", segmentID).Find(&segment).Error; err != nil {

			log.Panicln(err.Error())
			context.Status(404)
		}

		//if (segment.SegmentListID)

		segment.Start = segmentEditRequest.Start
		segment.Text = segmentEditRequest.Text
		segment.End = segmentEditRequest.End

		db.Save(segment)

		// check

		//if db.Preload("Video").Where("uuid = ? ", segmentID).Find(&segment).Error != nil {
		//
		//	context.Status(404)
		//}

		//log.Printf("segmentList: %v\n", len(segmentList.Segments))
		//segments := MakeApiSegments(segmentList)
		//
		//context.JSON(200, segments)

	}
}
func MakeAudioSegmentsDELETE(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		segmentID := context.Param("id")
		//youtubeID := context.Param("audioId")
		var segmentEditRequest SegmentEditRequest
		if err := context.BindJSON(&segmentEditRequest); err != nil {
			context.Status(500)
		}

		log.Print(segmentEditRequest)

		var segment *core.VideoSegment
		//
		//youtubeID := context.Param("id")
		if err := db.Where("uuid = ? ", segmentID).Find(&segment).Error; err != nil {

			log.Println(err.Error())
			context.Status(404)
		}

		db.Delete(segment)

		if err := db.Delete(segment).Error; err != nil {

			log.Println(err.Error())
			context.Status(500)
		}

		context.Status(204)
	}
}

func MakeApiSegments(list *core.Video) []ApiVideoSegment {
	apiSegs := make([]ApiVideoSegment, 0)

	for _, segment := range list.Segments {
		apiSegs = append(apiSegs, ApiVideoSegment{
			Start: segment.Start,
			End:   segment.End,
			Text:  segment.Text,
			UUID:  segment.UUID,
		})
	}

	return apiSegs
}

func initializeSegments(mediaDirectory string, youtubeID string, segmentList *core.Video, db gorm.DB) error {
	segmentsFile, err := ioutil.ReadFile(mediaDirectory + "/" + youtubeID + ".ja.vtt")
	segments, err := parseSegments(string(segmentsFile))
	if err != nil {
		return err
	}
	dbSegments := make([]core.VideoSegment, 0)
	for _, segment := range segments {
		start, err := parseSegmentTime(segment.Start)
		if err != nil {
			return err
		}
		end, err := parseSegmentTime(segment.End)
		if err != nil {
			return err
		}
		dbSegments = append(dbSegments, core.VideoSegment{
			Start: start,
			End:   end,
			Text:  segment.Text,
			UUID:  uuid.NewString(),
		})
	}
	segmentList = &core.Video{
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
