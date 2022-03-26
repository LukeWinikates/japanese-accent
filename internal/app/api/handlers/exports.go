package handlers

import (
	"fmt"
	"github.com/LukeWinikates/japanese-accent/internal/app/api/types"
	"github.com/LukeWinikates/japanese-accent/internal/app/database/queries"
	"github.com/LukeWinikates/japanese-accent/internal/app/media"
	"github.com/LukeWinikates/japanese-accent/internal/app/worker"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
)

func MakeExportCREATE(mediaDirectory string, db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		var request types.ExportCreateRequest

		if err := context.BindJSON(&request); err != nil {
			log.Println(err.Error())
			context.Status(500)
			return
		}

		video, err := queries.LoadVideo(db, request.VideoUUID)
		if err != nil {
			context.Status(500)
			log.Printf("Error: %s\n", err.Error())
			return
		}
		files := media.FindAudioFile(mediaDirectory, request.VideoUUID)

		go func() {
			fmt.Println(worker.WithDB(db).Run(files.Path, video))
		}()
		context.Status(200)
	}
}
