package slices

func Any[T interface{}](collection []T, pred func(T) bool) bool {
	for _, item := range collection {
		if pred(item) {
			return true
		}
	}
	return false
}
