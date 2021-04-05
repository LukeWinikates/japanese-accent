package main

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/server"
	"github.com/adrg/xdg"
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	log.Println("Data directories:", xdg.DataDirs)
	wordsFilePath := readConfig()

	r := gin.Default()
	server.Configure(r, wordsFilePath)
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}

func readConfig() string {
	configFilePath, err := xdg.DataFile("japanese-accent/data/words.txt")
	if err != nil {
		log.Fatal(err)
	}
	return configFilePath
}
