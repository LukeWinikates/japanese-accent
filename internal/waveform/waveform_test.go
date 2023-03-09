//go:build integration
// +build integration

package waveform

import (
	"github.com/stretchr/testify/assert"
	"github.com/u2takey/go-utils/env"
	"testing"
)

func TestWaveform(t *testing.T) {
	samples, err := Waveform(
		env.GetEnvAsStringOrFallback("PROJECT_DIR", ".")+"/test/test.m4a",
		200)

	if err != nil {
		t.Error("err was supposed to be nil")
		t.Error(err.Error())
	}

	assert.Equal(t, 1008, len(samples))
	assert.Equal(t, int16(-22), samples[0])
}

func TestDownsample(t *testing.T) {
	assert.Equal(t, []int16{4, 10}, simpleDownsample([]int16{2, 6, 8, 12}, 2, 1))
	assert.Equal(t, []int16{2, 6, 8, 12}, simpleDownsample([]int16{2, 6, 8, 12}, 2, 2))
	assert.Equal(t, []int16{4, 10, 5}, simpleDownsample([]int16{2, 6, 8, 12, 5}, 2, 1))
	assert.Equal(t, []int16{6}, simpleDownsample([]int16{2, 6, 8, 12, 5, 2, 6, 8, 12, 5}, 8000, 800))
}
