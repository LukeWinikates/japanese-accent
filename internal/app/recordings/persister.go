package recordings

import (
	"github.com/gin-gonic/gin"
	"mime/multipart"
)

const dataDirectory = "./data/recordings/"

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

type Persister interface {
	PersistFile(file *multipart.FileHeader) error
}
