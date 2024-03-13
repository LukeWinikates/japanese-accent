package waveform

import (
	"encoding/binary"
	"fmt"
	"log"
	"math"
	"os"
	"path"

	"github.com/u2takey/ffmpeg-go"
)

func Waveform(source string, sampleRate int) ([]int16, error) {
	targetPath := path.Join(path.Dir(source), fmt.Sprintf("%s-waveform-8000.bin", path.Base(source)))
	_, err := os.Stat(targetPath)
	if err != nil {
		if err = waveform(source, targetPath, 8000); err != nil {
			return nil, fmt.Errorf("could not create waveform: %s", err.Error())
		}
	}

	bytes, err := readBytes(targetPath)
	if err != nil {
		return nil, fmt.Errorf("could not read from temp file: %s", err.Error())
	}

	return simpleDownsample(bytes, 8000, sampleRate), nil
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

func abs(v int16) int16 {
	if v < 0 {
		return -v
	}
	return v
}

func simpleDownsample(samples []int16, sourceSampleRate, targetSampleRate int) []int16 {
	blockSize := sourceSampleRate / targetSampleRate
	newSize := int64(math.Ceil(float64(len(samples)) / float64(blockSize)))
	downsampled := make([]int16, newSize)
	rollingSum := int16(0)
	for i := 0; i < len(samples); i++ {
		rollingSum += abs(samples[i])
		if (i+1)%blockSize == 0 {
			downsampled[i/blockSize] = rollingSum / int16(blockSize)
			rollingSum = 0
		}
	}
	if len(samples)%blockSize != 0 {
		downsampled[newSize-1] = rollingSum / int16(len(samples)%blockSize)
	}
	return downsampled
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
		WithErrorOutput(log.Default().Writer()).
		Run()
}
