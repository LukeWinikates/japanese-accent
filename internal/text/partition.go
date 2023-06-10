package text

func RePartition(a, b string) (string, string) {
	maxLen := len(a)
	if len(a) > len(b) {
		maxLen = len(b)
	}

	for i := maxLen; i > 0; i-- {
		subA := a[len(a)-i:]
		subB := b[:i]
		if subA == subB {
			return a, b[i+1:]
		}
	}

	return a, b
}
