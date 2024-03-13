package text

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRePartition(t *testing.T) {
	a, b := RePartition("a good time", "good time was had")
	assert.Equal(t, "a good time", a)
	assert.Equal(t, "was had", b)

	a, b = RePartition("a good time was", " was had")
	assert.Equal(t, "a good time was", a)
	assert.Equal(t, "had", b)

	a, b = RePartition("", "was had")
	assert.Equal(t, "", a)
	assert.Equal(t, "was had", b)

	a, b = RePartition("a good", "")
	assert.Equal(t, "a good", a)
	assert.Equal(t, "", b)

	a, b = RePartition("123", "23")
	assert.Equal(t, "123", a)
	assert.Equal(t, "", b)
}
