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
		clips, err := queries.FindClipsForPlaylist(db, playlistCreate.Count)

		if err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		newString := uuid.NewString()

		playlist := database.Playlist{
			UUID:  newString,
			Name:  "New Playlist: " + time.Now().Format(time.RFC822),
			Clips: clips,
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
		if err := db.Preload("Clips.Video").
			Preload("Clips.ClipPitch").
			Where("uuid = ?", playlistID).
			First(&playlist).Error; err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}

		apiClips := make([]types.Clip, len(playlist.Clips))

		for i, clip := range playlist.Clips {
			var maybePitch *types.ClipPitch
			if clip.ClipPitch != nil {
				var pitch = makeApiPitch(*clip.ClipPitch)
				maybePitch = &pitch
			}
			apiClips[i] = types.Clip{
				StartMS:   clip.StartMS,
				EndMS:     clip.EndMS,
				Text:      clip.Text,
				UUID:      clip.UUID,
				VideoUUID: clip.Video.YoutubeID,
				Pitch:     maybePitch,
				Priority:  clip.Priority,
			}
		}

		sort.Slice(apiClips, func(i, j int) bool {
			return apiClips[i].Priority > apiClips[j].Priority
		})

		context.JSON(200, types.Playlist{
			ID:    playlistID,
			Clips: apiClips,
		})
	}
}
