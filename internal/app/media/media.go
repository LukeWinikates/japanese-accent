package media

import (
	"encoding/json"
	"fmt"
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
	return findFileByName(subtitleFilePath)
}

func findFileByName(filePath string) FindFileResult {
	_, err := os.Lstat(filePath)
	if err != nil && os.IsNotExist(err) {
		return FindFileResult{
			IsFound: false,
			Path:    "",
			Err:     err,
		}
	}
	return FindFileResult{
		IsFound: true,
		Path:    filePath,
		Err:     nil,
	}
}

func FindFiles(mediaDirectory string, videoId string) FilesFindResult {
	return FilesFindResult{
		HasSubtitleFile: FindSubtitleFile(mediaDirectory, videoId).IsFound,
		HasMediaFile:    FindAudioFile(mediaDirectory, videoId).IsFound,
	}
}

func FindWaveformFile(mediaDirectory string, videoId string) FindFileResult {
	return findFileByName(waveformFilePath(mediaDirectory, videoId))
}

func waveformFilePath(mediaDirectory string, videoId string) string {
	return mediaDirectory + "/" + videoId + "-waveform.json"
}

func WriteWaveformFile(mediaDirectory string, videoId string, data []int16, sampleRate int) error {
	open, err := os.Create(waveformFilePath(mediaDirectory, videoId))
	fmt.Println("writing file")
	if err != nil {
		return err
	}
	defer open.Close()
	return json.NewEncoder(open).Encode(map[string]interface{}{
		"samples":    data,
		"sampleRate": sampleRate,
	})
}
