package waveform

import (
	"encoding/binary"
	"fmt"
	"github.com/u2takey/ffmpeg-go"
	"os"
)

func Waveform(source string, sampleRate int) ([]int16, error) {
	tmp, err := os.MkdirTemp("", "")
	if err != nil {
		return nil, fmt.Errorf("could not create a temp directory: %s", err.Error())
	}
	targetPath := tmp + "/data.bin"

	if err = waveform(source, targetPath, sampleRate); err != nil {
		return nil, err
	}

	return readBytes(targetPath)
}

func readBytes(path string) ([]int16, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	defer f.Close()

	stat, err := f.Stat()
	if err != nil {
		return nil, err
	}
	data := make([]int16, stat.Size()/2)
	err = binary.Read(f, binary.LittleEndian, &data)
	return data, err
}

func waveform(source string, targetPath string, sampleRate int) error {
	return ffmpeg_go.Input(source, ffmpeg_go.KwArgs{}).
		Output(targetPath, ffmpeg_go.KwArgs{
			"filter:a": fmt.Sprintf("aresample=%v", sampleRate),
			"ac":       "1",
			"map":      "0:a",
			"c:a":      "pcm_s16le",
			"f":        "data",
		}).
		//ErrorToStdOut().
		Run()
}
