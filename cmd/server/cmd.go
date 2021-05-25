package main

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/server"
	"github.com/adrg/xdg"
	"github.com/gin-gonic/gin"
	"log"
)

type config struct {
	WordsFilePath string
	MediaDirPath  string
}

func main() {
	log.Println("Data directories:", xdg.DataDirs)
	config := readConfig()

	r := gin.Default()
	server.Configure(r, config.WordsFilePath, config.MediaDirPath)
	log.Fatalln(r.Run().Error())
}

func readConfig() config {
	wordsFilePath, err := xdg.DataFile("japanese-accent/data/words.txt")
	mediaPath, err := xdg.DataFile("japanese-accent/data/media")
	if err != nil {
		log.Fatal(err)
	}
	return config{
		WordsFilePath: wordsFilePath,
		MediaDirPath:  mediaPath,
	}
}
