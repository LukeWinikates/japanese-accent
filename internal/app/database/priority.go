package database

import "gorm.io/gorm"

const BoostPriority = 50
const ActivityPriority = -5

func RecalculatePriority(db gorm.DB, segmentID uint) error {
	var segment VideoSegment
	var boosts []SegmentBoost
	var activities []SegmentActivity
	if err := db.
		Find(&segment, segmentID).Error; err != nil {
		return err
	}

	if err := db.
		Where("segment_id = ?", segmentID).
		Find(&boosts).Error; err != nil {
		return err
	}

	if err := db.
		Where("segment_id = ?", segmentID).
		Find(&activities).Error; err != nil {
		return err
	}

	segment.Priority = BoostPriority * len(boosts)
	segment.Priority += ActivityPriority * len(activities)

	return db.Save(&segment).Error
}

func RecalculateAllSegments(db gorm.DB) error {
	var segments []uint
	db.Table("video_segments").Pluck("id", &segments)

	for _, segment := range segments {
		err := RecalculatePriority(db, segment)
		if err != nil {
			return err
		}
	}
	return nil
}
