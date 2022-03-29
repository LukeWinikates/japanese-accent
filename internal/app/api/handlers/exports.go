package handlers

import (
	"context"
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database/queries"
	"github.com/LukeWinikates/japanese-accent/internal/app/media"
	"github.com/LukeWinikates/japanese-accent/internal/app/worker"
	"github.com/LukeWinikates/japanese-accent/internal/export"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
	"time"
)

type exportTracker struct {
	progress  export.Progress
	startTime time.Time
	videoID   string
}

var inProcess = make(map[string]*exportTracker)

func MakeExportCREATE(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		var request types.ExportCreateRequest
		if err := ginContext.BindJSON(&request); err != nil {
			log.Println(err.Error())
			ginContext.Status(500)
			return
		}

		if inProcess[request.VideoUUID] != nil {
			ginContext.JSON(200, types.ExportCreateResponse{
				ID: request.VideoUUID,
			})
		}

		video, err := queries.LoadVideo(db, request.VideoUUID)
		if err != nil {
			ginContext.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}
		files := media.FindAudioFile(mediaDirectory, request.VideoUUID)

		go func() {
			watcher := make(chan export.Progress)

			inProcess[request.VideoUUID] = &exportTracker{
				startTime: time.Now(),
				videoID:   request.VideoUUID,
			}
			go func() {
				ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
				defer cancel()

				for !inProcess[request.VideoUUID].progress.Ended {
					select {
					case progress := <-watcher:
						inProcess[request.VideoUUID].progress = progress
					case <-ctx.Done():
						return
					}
				}
				return
			}()

			err := worker.WithDB(db).Run(files.Path, video, watcher)
			if err != nil {
				log.Println(err.Error())
			}
		}()

		ginContext.JSON(200, types.ExportCreateResponse{
			ID: request.VideoUUID,
		})
	}
}

func MakeExportGET() gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		videoId := ginContext.Param("videoUUID")
		tracker := inProcess[videoId]

		if tracker == nil {
			ginContext.Status(404)
			return
		}

		ginContext.JSON(200, types.ExportGetResponse{
			ID:       videoId,
			Progress: tracker.progress.Describe(),
			Done:     tracker.progress.Ended,
		})
	}
}
