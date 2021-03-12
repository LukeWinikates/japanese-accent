package server

import (
	"errors"
	"github.com/stretchr/testify/assert"
	"mime/multipart"
	"testing"
)

type fakePersister struct {
	Files []*multipart.FileHeader
	err   error
}

func (fp *fakePersister) PersistFile(file *multipart.FileHeader) error {
	if fp.err == nil {
		fp.Files = append(fp.Files, file)
	}

	return fp.err
}

func TestRecordingPersistenceSuccess(t *testing.T) {
	file1 := multipart.FileHeader{
		Filename: "file1",
	}
	file2 := multipart.FileHeader{
		Filename: "file2",
	}
	files := []*multipart.FileHeader{&file1, &file2}
	persister := fakePersister{
		Files: []*multipart.FileHeader{},
		err:   nil,
	}
	err := PersistFiles(files, &persister)

	if err != nil {
		t.Error("err was supposed to be nil")
	}

	assert.ElementsMatch(t, files, persister.Files)
}

func TestRecordingPersistenceFail(t *testing.T) {
	file1 := multipart.FileHeader{
		Filename: "file1",
	}
	file2 := multipart.FileHeader{
		Filename: "file2",
	}
	files := []*multipart.FileHeader{&file1, &file2}
	err := PersistFiles(files, &fakePersister{
		Files: []*multipart.FileHeader{},
		err:   errors.New("foo"),
	})

	if err == nil {
		t.Error("err was not supposed to be nil")
	}
}
