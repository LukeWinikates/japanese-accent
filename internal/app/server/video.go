package server

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/core"
	"github.com/LukeWinikates/japanese-accent/internal/app/vtt"
	"github.com/LukeWinikates/japanese-accent/internal/app/youtube"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"io/ioutil"
	"log"
	"os"
	"time"
)

func MakeVideoPOST(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var videoCreateRequest ApiVideoCreate
		if err := context.BindJSON(&videoCreateRequest); err != nil {
			context.Status(500)
			return
		}
		video := &core.Video{
			YoutubeID:      youtube.VideoIDFromURL(videoCreateRequest.URL),
			URL:            videoCreateRequest.URL,
			Title:          videoCreateRequest.Title,
			Segments:       nil,
			VideoStatus:    core.Pending,
			LastActivityAt: time.Now(),
		}

		if err := db.Save(video).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}
	}
}

func MakeVideoPublishPOST(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var video *core.Video
		youtubeID := context.Param("id")
		if err := db.Where("youtube_id = ?", youtubeID).First(&video).Error; err != nil {
			context.Status(404)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		if video.VideoStatus != core.Imported {
			log.Printf("Error: Can't Publish this video because it's in the wrong status (%s)\n", video.VideoStatus)
			context.Status(500)
		}

		video.VideoStatus = core.Complete

		if err := db.Save(&video).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		apiVideo := makeApiVideo(video)

		context.JSON(200, apiVideo)
	}
}

func MakeVideoListGET(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var videos *[]core.Video
		if err := db.Preload("Segments", func(db *gorm.DB) *gorm.DB {
			return db.Order("video_segments.start ASC")
		}).Order("last_activity_at DESC").Limit(20).Find(&videos).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		apiVideos := MakeApiVideoSummaries(*videos)

		context.JSON(200, apiVideos)
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

		if video.VideoStatus == core.Pending {
			subtitleFilePath := mediaDirectory + "/" + youtubeID + ".ja.vtt"
			subtitleFileContents, err := ioutil.ReadFile(subtitleFilePath)
			if err != nil && os.IsNotExist(err) {
				log.Printf("No subtitle file found; continuing")
				if FindMediaFile(mediaDirectory, youtubeID).IsFound {
					video.VideoStatus = core.Imported
				}
			} else if err = initializeSegments(string(subtitleFileContents), video, db); err != nil {
				log.Printf("Error while importing subtitle file: %s\n", err.Error())
			} else {
				video.VideoStatus = core.Imported
			}
		}

		apiVideo := makeApiVideo(video)

		context.JSON(200, apiVideo)
	}
}

func makeApiVideo(video *core.Video) ApiVideo {
	apiSegs := make([]ApiVideoSegment, 0)

	for _, segment := range video.Segments {
		apiSegs = append(apiSegs, ApiVideoSegment{
			Start:          segment.Start,
			End:            segment.End,
			Text:           segment.Text,
			UUID:           segment.UUID,
			VideoUUID:      video.YoutubeID,
			LastActivityAt: segment.LastActivityAt,
		})
	}

	return ApiVideo{
		Title:          video.Title,
		URL:            video.URL,
		VideoID:        video.YoutubeID,
		VideoStatus:    video.VideoStatus,
		Segments:       apiSegs,
		LastActivityAt: video.LastActivityAt,
	}
}

func initializeSegments(subtitleFile string, video *core.Video, db gorm.DB) error {

	segments, err := vtt.ParseSegments(subtitleFile)
	if err != nil {
		return err
	}
	dbSegments := make([]core.VideoSegment, 0)
	for _, segment := range segments {
		dbSegments = append(dbSegments, core.VideoSegment{
			Start:   segment.Start,
			End:     segment.End,
			Text:    segment.Text,
			UUID:    uuid.NewString(),
			VideoID: video.ID,
		})
	}

	return db.Model(video).
		Association("Segments").
		Replace(dbSegments)
}
