package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/app/database/queries"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"log"
	"sort"
	"time"
)

func MakePlaylistPost(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var playlistCreate types.PlaylistCreateRequest
		if err := context.BindJSON(&playlistCreate); err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}
		segments, err := queries.FindSegmentsForPlaylist(db, playlistCreate.Count)

		if err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		newString := uuid.NewString()

		playlist := database.Playlist{
			UUID:     newString,
			Name:     "New Playlist: " + time.Now().Format(time.RFC822),
			Segments: segments,
		}

		if err := db.Create(&playlist).Error; err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		context.JSON(200, types.Playlist{
			ID: newString,
		})
	}
}

func MakePlaylistGET(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var playlist database.Playlist
		playlistID := context.Param("id")
		if err := db.Preload("Segments.Video").
			Preload("Segments.SegmentPitch").
			Where("uuid = ?", playlistID).
			First(&playlist).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		apiSegments := make([]types.VideoSegment, len(playlist.Segments))

		for i, segment := range playlist.Segments {
			var maybePitch *types.VideoSegmentPitch
			if segment.SegmentPitch != nil {
				var pitch = makeApiPitch(*segment.SegmentPitch)
				maybePitch = &pitch
			}
			apiSegments[i] = types.VideoSegment{
				StartMS:   segment.StartMS,
				EndMS:     segment.EndMS,
				Text:      segment.Text,
				UUID:      segment.UUID,
				VideoUUID: segment.Video.YoutubeID,
				Pitch:     maybePitch,
				Priority:  segment.Priority,
			}
		}

		sort.Slice(apiSegments, func(i, j int) bool {
			return apiSegments[i].Priority > apiSegments[j].Priority
		})

		context.JSON(200, types.Playlist{
			ID:       playlistID,
			Segments: apiSegments,
		})
	}
}
