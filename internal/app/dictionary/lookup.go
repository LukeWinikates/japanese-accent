package dictionary

import (
	"gorm.io/gorm"
	"log"
)

func LookForWord(db *gorm.DB, term string) []Word {
	var words []Word
	log.Println(term)
	log.Println(db.Where("lemma like ?", term+"%").Preload("Senses.Definitions").Find(&words))
	return words
}
