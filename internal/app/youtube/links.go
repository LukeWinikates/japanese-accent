package youtube

import "strings"

func VideoIDFromURL(URL string) string {
	return strings.Split(URL, "=")[1]
}
