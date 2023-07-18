package loader

import "github.com/blevesearch/bleve/v2"

func main() {
	mapping := bleve.NewIndexMapping()
	index, err := bleve.New("example.bleve", mapping)
	if err != nil {
		panic(err)
	}

	message := struct {
		Id   string
		From string
		Body string
	}{
		Id:   "example",
		From: "marty.schoch@gmail.com",
		Body: "bleve indexing is easy",
	}
	// load ojad files
	// turn them into go structs
	// iterate over them
	index.Index(message.Id, message)
}
