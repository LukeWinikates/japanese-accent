package main

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/adrg/xdg"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
)

type config struct {
	MediaDirPath string
	DatabaseFile string
}

func main() {
	log.Println("Data directories:", xdg.DataDirs)
	config := readConfig()
	db := prepareDatabase(config.DatabaseFile)

	r := gin.Default()

	api.Configure(r, config.MediaDirPath, *db)
	log.Fatalln(r.Run("localhost:8080").Error())
}

func prepareDatabase(databaseFile string) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(databaseFile), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		log.Println(err.Error())
		log.Fatal("failed to connect database")
	}
	err = database.InitializeDatabase(*db)
	if err != nil {
		log.Println(err.Error())
		log.Fatal("failed to connect database")
	}
	return db
}

func readConfig() config {
	mediaPath, err := xdg.DataFile("japanese-accent/data/media")
	if err != nil {
		log.Fatal(err)
	}

	databaseFile, err := xdg.DataFile("japanese-accent/data/data.db")
	if err != nil {
		log.Fatal(err)
	}

	return config{
		MediaDirPath: mediaPath,
		DatabaseFile: databaseFile,
	}
}
