package text

import (
	"unicode/utf8"
)

func RePartition(a, b string) (string, string) {
	maxLen := len(a)
	if len(a) > len(b) {
		maxLen = len(b)
	}

	for i := maxLen; i > 0; i-- {
		subA := a[len(a)-i:]
		subB := b[:i]
		if subA == subB {
			if i == len(b) {
				return a, ""
			}

			j := 1
			for ; j < 4; j++ {
				if i+j >= len(b) {
					return a, ""
				}
				if utf8.RuneStart(b[i+j]) {
					break
				}
			}

			return a, b[i+j:]
		}
	}

	return a, b
}
