package handlers

import (
	"fmt"
	"github.com/LukeWinikates/japanese-accent/internal/app/recordings"
	"github.com/gin-gonic/gin"
	"net/http"
)

func HandleRecordingUpload(context *gin.Context) {
	form, _ := context.MultipartForm()
	files := form.File["file[]"]
	err := recordings.PersistFiles(files, recordings.NewContextPersister(context))

	if err != nil {
		fmt.Print(err.Error())
		context.Status(http.StatusInternalServerError)
		return
	}

	context.Status(http.StatusAccepted)
}
