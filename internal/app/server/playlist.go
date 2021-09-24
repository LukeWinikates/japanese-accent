package server

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/core"
	"github.com/LukeWinikates/japanese-accent/internal/playlists"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"log"
	"time"
)

func MakePlaylistPost(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var playlistCreate PlaylistCreateRequest
		if err := context.BindJSON(&playlistCreate); err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}
		segments, err := playlists.MakeSmartPlaylist(db, playlistCreate.Count)

		if err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		newString := uuid.NewString()

		playlist := core.Playlist{
			UUID:     newString,
			Name:     "New Playlist: " + time.Now().Format(time.RFC822),
			Segments: segments,
		}

		if err := db.Create(&playlist).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		context.JSON(200, ApiPlaylist{
			ID: newString,
		})
	}
}

func MakePlaylistGET(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var playlist core.Playlist
		playlistID := context.Param("id")
		if err := db.Preload("Segments.Video").Where("uuid = ?", playlistID).First(&playlist).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		apiSegments := make([]ApiVideoSegment, len(playlist.Segments))

		for i, segment := range playlist.Segments {
			apiSegments[i] = ApiVideoSegment{
				Start:     segment.Start,
				End:       segment.End,
				Text:      segment.Text,
				UUID:      segment.UUID,
				VideoUUID: segment.Video.YoutubeID,
			}
		}

		context.JSON(200, ApiPlaylist{
			ID:       playlistID,
			Segments: apiSegments,
		})
	}
}
