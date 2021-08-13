package main

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/core"
	"github.com/LukeWinikates/japanese-accent/internal/app/server"
	"github.com/adrg/xdg"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
)

type config struct {
	WordsFilePath string
	MediaDirPath  string
	DatabaseFile  string
}

func main() {
	log.Println("Data directories:", xdg.DataDirs)
	config := readConfig()
	db := prepareDatabase(config.DatabaseFile)

	r := gin.Default()

	server.Configure(r, config.WordsFilePath, config.MediaDirPath, *db)
	log.Fatalln(r.Run().Error())
}

func prepareDatabase(databaseFile string) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(databaseFile), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		log.Println(err.Error())
		log.Fatal("failed to connect database")
	}
	err = core.InitializeDatabase(*db)
	if err != nil {
		log.Println(err.Error())
		log.Fatal("failed to connect database")
	}
	return db
}

func readConfig() config {
	wordsFilePath, err := xdg.DataFile("japanese-accent/data/words.txt")
	if err != nil {
		log.Fatal(err)
	}
	mediaPath, err := xdg.DataFile("japanese-accent/data/media")
	if err != nil {
		log.Fatal(err)
	}

	databaseFile, err := xdg.DataFile("japanese-accent/data/data.db")
	if err != nil {
		log.Fatal(err)
	}

	return config{
		WordsFilePath: wordsFilePath,
		MediaDirPath:  mediaPath,
		DatabaseFile:  databaseFile,
	}
}
