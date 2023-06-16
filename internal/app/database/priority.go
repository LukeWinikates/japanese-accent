package database

import "gorm.io/gorm"

const BoostPriority = 50
const ActivityPriority = -5

func RecalculatePriority(db gorm.DB, clipID uint) error {
	var clip Clip
	var boosts []ClipBoost
	var activities []ClipActivity
	if err := db.
		Find(&clip, clipID).Error; err != nil {
		return err
	}

	if err := db.
		Where("clip_id = ?", clipID).
		Find(&boosts).Error; err != nil {
		return err
	}

	if err := db.
		Where("clip_id = ?", clipID).
		Find(&activities).Error; err != nil {
		return err
	}

	clip.Priority = BoostPriority * len(boosts)
	clip.Priority += ActivityPriority * len(activities)

	return db.Save(&clip).Error
}

func RecalculateAllClipPriorities(db gorm.DB) error {
	var clips []uint
	db.Table("clips").Pluck("id", &clips)

	for _, clip := range clips {
		err := RecalculatePriority(db, clip)
		if err != nil {
			return err
		}
	}
	return nil
}
