package media

import (
	"io/fs"
	"os"
)

func FindAudioFile(mediaDirectory string, videoId string) FindFileResult {
	mediaDir := os.DirFS(mediaDirectory)
	files, err := fs.Glob(mediaDir, videoId+"*.m*")
	if err != nil {
		return FindFileResult{
			IsFound: false,
			Path:    "",
			Err:     err,
		}
	}
	if len(files) == 0 {
		return FindFileResult{
			IsFound: false,
			Path:    "",
			Err:     nil,
		}
	}
	return FindFileResult{
		IsFound: true,
		Path:    mediaDirectory + "/" + files[0],
		Err:     nil,
	}
}

type FindFileResult struct {
	IsFound bool
	Path    string
	Err     error
}

type FilesFindResult struct {
	HasSubtitleFile bool
	HasMediaFile    bool
}

func FindSubtitleFile(mediaDirectory string, videoId string) FindFileResult {
	subtitleFilePath := mediaDirectory + "/" + videoId + ".ja.vtt"
	_, err := os.Lstat(subtitleFilePath)
	if err != nil && os.IsNotExist(err) {
		return FindFileResult{
			IsFound: false,
			Path:    "",
			Err:     err,
		}
	}
	return FindFileResult{
		IsFound: true,
		Path:    subtitleFilePath,
		Err:     nil,
	}

}

func FindFiles(mediaDirectory string, videoId string) FilesFindResult {
	return FilesFindResult{
		HasSubtitleFile: FindSubtitleFile(mediaDirectory, videoId).IsFound,
		HasMediaFile:    FindAudioFile(mediaDirectory, videoId).IsFound,
	}
}
