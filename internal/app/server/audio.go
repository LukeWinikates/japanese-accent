package server

import (
	"bufio"
	"github.com/LukeWinikates/japanese-accent/internal/app/core"
	"github.com/LukeWinikates/japanese-accent/internal/app/youtube"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"io/fs"
	"io/ioutil"
	"log"
	"os"
	"regexp"
	"strconv"
	"strings"
)

func MakeAudioGET(mediaDirectory string) gin.HandlerFunc {
	return func(context *gin.Context) {
		mediaDir := os.DirFS(mediaDirectory)
		videoId := context.Param("id")
		files, err := fs.Glob(mediaDir, videoId+"*.m*")
		if err != nil {
			log.Printf(err.Error())
			context.Status(500)
		}

		if len(files) == 0 {
			log.Println("no files found!")
			context.Status(404)
		}
		context.File(mediaDirectory + "/" + files[0])
	}
}

func MakeVideoPOST(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var videoCreateRequest ApiVideoCreate
		if err := context.BindJSON(&videoCreateRequest); err != nil {
			context.Status(500)
			return
		}
		video := &core.Video{
			YoutubeID:   youtube.VideoIDFromURL(videoCreateRequest.URL),
			URL:         videoCreateRequest.URL,
			Title:       videoCreateRequest.Title,
			Segments:    nil,
			VideoStatus: core.Pending,
		}

		if err := db.Save(video).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}
	}
}

func MakeVideoGET(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var video *core.Video

		youtubeID := context.Param("id")
		if err := db.Preload("Segments", func(db *gorm.DB) *gorm.DB {
			return db.Order("video_segments.start ASC")
		}).Where("youtube_id = ?", youtubeID).First(&video).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		log.Printf("segment count: %v\n", len(video.Segments))

		if video.VideoStatus == core.Pending {
			log.Printf("no segment list")
			err := initializeSegments(mediaDirectory, youtubeID, video, db)
			if err != nil {
				//context.Status(500)
				log.Printf("Error: %s\n", err.Error())
			} else {
				video.VideoStatus = core.Imported
			}
		}

		apiVideo := MakeApiVideo(video)

		context.JSON(200, apiVideo)
	}
}

type SegmentEditRequest = ApiVideoSegment
type SegmentCreateRequest = ApiVideoSegmentCreate

func MakeAudioSegmentsPOST(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		segmentID := context.Param("id")
		var segmentEditRequest SegmentEditRequest
		if err := context.BindJSON(&segmentEditRequest); err != nil {
			context.Status(500)
		}

		log.Print(segmentEditRequest)

		var segment *core.VideoSegment
		if err := db.Where("uuid = ? ", segmentID).Find(&segment).Error; err != nil {
			context.Status(404)
			log.Println(err.Error())
		}

		segment.Start = segmentEditRequest.Start
		segment.Text = segmentEditRequest.Text
		segment.End = segmentEditRequest.End

		db.Save(segment)
	}
}
func MakeAudioSegmentsCREATE(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var createRequest SegmentCreateRequest
		if err := context.BindJSON(&createRequest); err != nil {
			context.Status(500)
		}
		var video *core.Video

		if err := db.Where("youtube_id = ? ", createRequest.VideoID).Find(&video).Error; err != nil {
			context.Status(404)
			log.Println(err.Error())
			return
		}
		log.Print(createRequest)

		var segment = core.VideoSegment{
			UUID:  uuid.NewString(),
			Start: createRequest.Start,
			Text:  createRequest.Text,
			End:   createRequest.End,
		}

		if err := db.Model(video).Association("Segments").Append(&segment); err != nil {
			context.Status(500)
			log.Println(err.Error())
			return
		}

		context.JSON(201, ApiVideoSegment{
			UUID:  segment.UUID,
			Start: segment.Start,
			End:   segment.End,
			Text:  segment.Text,
		})
	}
}

func MakeAudioSegmentsDELETE(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		segmentID := context.Param("id")
		//youtubeID := context.Param("audioId")
		//var segmentEditRequest SegmentEditRequest
		//if err := context.BindJSON(&segmentEditRequest); err != nil {
		//	log.Println(err.Error())
		//	context.Status(500)
		//	return
		//}

		//log.Print(segmentEditRequest)

		var segment *core.VideoSegment
		//
		if err := db.Where("uuid = ? ", segmentID).Find(&segment).Error; err != nil {

			log.Println(err.Error())
			context.Status(404)
			return
		}

		//db.Delete(segment)

		if err := db.Delete(segment).Error; err != nil {

			log.Println(err.Error())
			context.Status(500)
			return
		}

		context.Status(204)
	}
}

func MakeApiVideo(video *core.Video) ApiVideo {
	apiSegs := make([]ApiVideoSegment, 0)

	for _, segment := range video.Segments {
		apiSegs = append(apiSegs, ApiVideoSegment{
			Start: segment.Start,
			End:   segment.End,
			Text:  segment.Text,
			UUID:  segment.UUID,
		})
	}

	return ApiVideo{
		Title:       video.Title,
		URL:         video.URL,
		VideoID:     video.YoutubeID,
		VideoStatus: video.VideoStatus,
		Segments:    apiSegs,
	}
}

func initializeSegments(mediaDirectory string, youtubeID string, video *core.Video, db gorm.DB) error {
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
			Start:   start,
			End:     end,
			Text:    segment.Text,
			UUID:    uuid.NewString(),
			VideoID: video.ID,
		})
	}
	video = &core.Video{
		YoutubeID: youtubeID,
		Segments:  dbSegments,
	}

	return db.Save(dbSegments).Error
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

	log.Printf("segments: %v\n", len(segments))

	return segments, nil
}
