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
