package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/database/queries"
	"github.com/LukeWinikates/japanese-accent/internal/app/media"
	"github.com/LukeWinikates/japanese-accent/internal/app/youtube"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
	"time"
)

func MakeVideoPOST(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var videoCreateRequest types.VideoCreate
		if err := context.BindJSON(&videoCreateRequest); err != nil {
			context.Status(500)
			return
		}
		video := &database.Video{
			YoutubeID:      videoCreateRequest.YoutubeID,
			Title:          videoCreateRequest.Title,
			Clips:          nil,
			LastActivityAt: time.Now(),
		}

		if err := db.Save(video).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}
	}
}

func MakeVideoPUT(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {

		var videoEdit types.VideoEdit
		if err := context.BindJSON(&videoEdit); err != nil {
			context.Status(500)
			return
		}

		var video *database.Video
		youtubeID := context.Param("videoUuid")
		if err := db.Where("youtube_id = ?", youtubeID).First(&video).Error; err != nil {
			context.Status(404)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		video.Text = videoEdit.Text
		video.Title = videoEdit.Title

		if err := db.Save(video).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}
	}
}

func MakeVideoListGET(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		videos, err := queries.RecentlyActiveVideos(db, 20)

		if err != nil {
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
		var video *database.Video
		youtubeID := context.Param("videoUuid")

		video, err := queries.LoadVideo(db, youtubeID)
		if err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}
		files := media.FindFiles(mediaDirectory, youtubeID)

		apiVideo := makeApiVideo(video, files)

		context.JSON(200, apiVideo)
	}
}

func makeApiVideo(video *database.Video, files media.FilesFindResult) types.Video {
	apiClips := make([]types.Clip, 0)
	for _, clip := range video.Clips {
		var pitch *types.ClipPitch = nil

		if clip.ClipPitch != nil {
			pitch = &types.ClipPitch{
				Pattern: clip.ClipPitch.Pattern,
				Morae:   clip.ClipPitch.Morae,
			}
		}

		apiClips = append(apiClips, types.Clip{
			StartMS:        clip.StartMS,
			EndMS:          clip.EndMS,
			Text:           clip.Text,
			UUID:           clip.UUID,
			VideoUUID:      video.YoutubeID,
			LastActivityAt: clip.LastActivityAt,
			Pitch:          pitch,
			ParentUUID:     clip.ParentUUID,
			Labels:         []string{"SAVED"},
		})
	}

	return types.Video{
		Title:          video.Title,
		URL:            youtube.URL(video.YoutubeID),
		VideoID:        video.YoutubeID,
		Clips:          apiClips,
		LastActivityAt: video.LastActivityAt,
		Text:           video.Text,
		Words:          MakeApiWords(video.Words),
		Files: types.Files{
			HasMediaFile:    files.HasMediaFile,
			HasSubtitleFile: files.HasSubtitleFile,
		},
	}
}
