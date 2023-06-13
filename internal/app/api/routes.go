package api

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/api/handlers"
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/forvo"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
)

func Configure(engine *gin.Engine, mediaDirPath string, db gorm.DB) {

	settings, err := LoadSettings(db)
	if err != nil {
		log.Fatalln("unable to load settings")
	}

	forvoClient := forvo.EmptyClient()

	if settings.ForvoApiKey != nil {
		forvoClient = forvo.MakeCachingClient(*settings.ForvoApiKey)
	}

	engine.Static("/public", "./web/public")
	engine.StaticFile("/", "./web/public/index.html")

	api := engine.Group("/api")
	{
		api.GET("/highlights", handlers.MakeHandleHighlightsGET(db))
		api.POST("/recordings", handlers.HandleRecordingUpload)

		api.POST("/boosts", handlers.MakeBoostPOST(db))

		api.POST("/activity", handlers.MakeActivityPost(db))

		api.POST("/playlists", handlers.MakePlaylistPost(db))
		api.GET("/playlists/:id", handlers.MakePlaylistGET(db))

		api.POST("word-analysis", handlers.MakeWordAnalysisCREATE(db, forvoClient))
		api.GET("word-analysis/:word", handlers.MakeWordAnalysisGET(db, forvoClient))

		api.POST("video-word-links", handlers.MakeVideoWordLinkCREATE(db))

		api.POST("exports", handlers.MakeExportCREATE(mediaDirPath, db))
		api.GET("exports/:videoUUID", handlers.MakeExportGET())

		appSettings := api.Group("/application-settings")
		{
			appSettings.GET("", handlers.MakeAppSettingsGET(db))
			appSettings.PUT("", handlers.MakeAppSettingsPUT(db))
		}

		debug := api.Group("/debug")
		{
			debug.POST("refresh-metrics", handlers.MakeRefreshMetricsPOST(db))
		}

		videos := api.Group("/videos/")
		{
			videos.POST("", handlers.MakeVideoPOST(db))
			videos.GET("", handlers.MakeVideoListGET(db))
			videos.GET(":videoUuid", handlers.MakeVideoGET(mediaDirPath, db))
			videos.PUT(":videoUuid", handlers.MakeVideoPUT(db))

			videos.GET(":videoUuid/advice", handlers.MakeVideoAdviceGET(mediaDirPath, db))
			videos.DELETE(":videoUuid/advice/clips/:sha", handlers.MakeSuggestedClipDELETE(mediaDirPath, db))

			videos.GET(":videoUuid/waveform", handlers.MakeWaveformGET(mediaDirPath, db))
			videos.POST(":videoUuid/clips/", handlers.MakeAudioClipsCREATE(db))
			videos.PUT(":videoUuid/clips/:id", handlers.MakeAudioClipsPUT(db))
			videos.DELETE(":videoUuid/clips/:id", handlers.MakeAudioClipsDELETE(db))
		}

		api.POST("/clips/:id/pitches", handlers.MakeClipPitchesCREATE(db))

		wordLists := api.Group("/wordlists/")
		{
			wordLists.GET(":id", handlers.MakeWordListGET(db))
			wordLists.GET("", handlers.MakeWordListListGET(db))
		}
	}

	media := engine.Group("/media")
	{
		media.GET("/audio/:id", handlers.MakeAudioGET(mediaDirPath))
	}
}

func LoadSettings(db gorm.DB) (database.Settings, error) {
	var settings *database.Settings
	if err := db.Find(&settings).Error; err != nil {
		return database.Settings{}, err
	}
	return *settings, nil
}
