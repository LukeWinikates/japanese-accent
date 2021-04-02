package server

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"mime/multipart"
	"net/http"
)

const dataDirectory = "./data/recordings/"

func HandleRecordingUpload(context *gin.Context) {
	form, _ := context.MultipartForm()
	files := form.File["file[]"]
	err := PersistFiles(files, NewContextPersister(context))

	if err != nil {
		fmt.Print(err.Error())
		context.Status(http.StatusInternalServerError)
		return
	}

	context.Status(http.StatusAccepted)
}

type GinContextPersister struct {
	context *gin.Context
}

func (p GinContextPersister) PersistFile(file *multipart.FileHeader) error {
	fileName := dataDirectory + file.Filename
	return p.context.SaveUploadedFile(file, fileName)
}

func NewContextPersister(context *gin.Context) Persister {
	return GinContextPersister{
		context,
	}
}

func PersistFiles(files []*multipart.FileHeader, persister Persister) error {
	for _, file := range files {
		err := persister.PersistFile(file)
		if err != nil {
			return err
		}
	}
	return nil
}
