package media

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
)

func FindAudioFile(mediaDirectory string, videoID string) FindFileResult {
	mediaDir := os.DirFS(mediaDirectory)
	files, err := fs.Glob(mediaDir, videoID+"*.m*")
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

func FindSubtitleFile(mediaDirectory string, videoID string) FindFileResult {
	if !safe(videoID) {
		return FindFileResult{
			IsFound: false,
			Path:    "",
			Err:     fmt.Errorf("youtubeID %s looks invalid", videoID),
		}
	}
	subtitleFilePath := mediaDirectory + "/" + videoID + ".ja.vtt"
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

func FindFiles(mediaDirectory string, videoID string) FilesFindResult {
	return FilesFindResult{
		HasSubtitleFile: FindSubtitleFile(mediaDirectory, videoID).IsFound,
		HasMediaFile:    FindAudioFile(mediaDirectory, videoID).IsFound,
	}
}

func FindWaveformFile(mediaDirectory string, videoID string) FindFileResult {
	return findFileByName(waveformFilePath(mediaDirectory, videoID))
}

func waveformFilePath(mediaDirectory string, videoID string) string {
	return mediaDirectory + "/" + videoID + "-waveform.json"
}

func WriteWaveformFile(mediaDirectory string, videoID string, data []int16, sampleRate int) error {
	open, err := os.Create(waveformFilePath(mediaDirectory, videoID))
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
