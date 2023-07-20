package main

import (
	"github.com/blevesearch/bleve/v2"
	"github.com/themoeway/jmdict-go"
	"log"
	"os"
)

func main() {
	jmdictPath := os.Getenv("JMDICT_FILE")
	indexPath := os.Getenv("OUTPUT_FILE")
	mapping := bleve.NewIndexMapping()
	index, err := bleve.New(indexPath, mapping)
	if err != nil {
		panic(err)
	}

	jdmictFile, err := os.Open(jmdictPath)

	if err != nil {
		panic(err)
	}

	dictionary, _, err := jmdict.LoadJmdict(jdmictFile)

	count := 0
	log.Println("got here")

	for _, entry := range dictionary.Entries {
		if count == 5 {
			break
		}
		if len(entry.Readings) > 0 {
			log.Println("nonempty")
			count++
		}
		for _, reading := range entry.Readings {
			log.Printf("%v\n", reading)
		}
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
