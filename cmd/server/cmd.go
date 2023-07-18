package main

import (
	"fmt"
	"github.com/LukeWinikates/japanese-accent/internal/app/api"
	"github.com/LukeWinikates/japanese-accent/internal/app/api/metrics"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/adrg/xdg"
	"github.com/blevesearch/bleve/v2"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
	"net/http"
)

type config struct {
	MediaDirPath        string
	DatabaseFile        string
	DictionaryIndexFile string
}

func main() {
	log.Println("Data directories:", xdg.DataDirs)
	config := readConfig()
	fmt.Println(config.DatabaseFile)
	db := prepareDatabase(config.DatabaseFile)
	dictionaryIndex := openDictionaryIndex(config.DictionaryIndexFile)

	r := gin.Default()

	api.Configure(r, config.MediaDirPath, *db, dictionaryIndex)
	r.POST("/analytics", metrics.HandleWebVital)
	r.GET("/metrics", wrap(promhttp.Handler()))
	log.Fatalln(r.Run("localhost:8080").Error())
}

func wrap(handler http.Handler) gin.HandlerFunc {
	return func(context *gin.Context) {
		handler.ServeHTTP(context.Writer, context.Request)
	}
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
		log.Fatal("failed to migrate database")
	}

	err = database.EnsureDatabaseReady(*db)
	if err != nil {
		log.Println(err.Error())
		log.Fatal("failed to initialize database")
	}

	return db
}

func openDictionaryIndex(path string) bleve.Index {
	index, err := bleve.Open(path)
	if err != nil {
		log.Println(err.Error())
		log.Fatal("failed to open dictionary")
	}
	return index
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

	dictionaryIndexFile, err := xdg.DataFile("japanese-accent/resource/dictionary.bleve")
	if err != nil {
		log.Fatal(err)
	}

	return config{
		MediaDirPath:        mediaPath,
		DatabaseFile:        databaseFile,
		DictionaryIndexFile: dictionaryIndexFile,
	}
}
