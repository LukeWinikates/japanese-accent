package worker

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/LukeWinikates/japanese-accent/internal/export"
	"gorm.io/gorm"
)

type realWorker struct {
	ExportPath string
	db         gorm.DB
}

type nullWorker struct {
}

func (w nullWorker) Run(_ string, _ *database.Video, _ chan export.Progress) error {
	return nil
}

type Worker interface {
	Run(videoPath string, video *database.Video, watch chan export.Progress) error
}

func WithDB(db gorm.DB) Worker {
	var settings database.Settings
	if err := db.Find(&settings).Error; err != nil {
		return nullWorker{}
	}

	if settings.AudioExportPath == nil {
		return nullWorker{}
	}

	return realWorker{
		ExportPath: *settings.AudioExportPath,
		db:         db,
	}
}

func (w realWorker) Run(videoPath string, video *database.Video, watcher chan export.Progress) error {
	recipe := export.Recipe{
		FilePath:        videoPath,
		Title:           video.Title,
		DestinationPath: w.ExportPath + "/" + video.Title,
		Clips:           recipeClipsFromVideo(video),
	}
	return export.WriteToPath(recipe, watcher)
}

func recipeClipsFromVideo(video *database.Video) []export.RecipeClip {
	recipeClips := make([]export.RecipeClip, 0)

	for _, clip := range video.Segments {
		recipeClips = append(recipeClips, export.RecipeClip{
			Name:  clip.Text,
			Start: clip.StartMS,
			End:   clip.EndMS,
		})
	}
	return recipeClips
}
