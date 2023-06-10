package text

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestRePartition(t *testing.T) {
	a, b := RePartition("a good time", "good time was had")
	assert.Equal(t, "a good time", a)
	assert.Equal(t, "was had", b)

	a, b = RePartition("a good time was", " was had")
	assert.Equal(t, "a good time was", a)
	assert.Equal(t, "had", b)
}
