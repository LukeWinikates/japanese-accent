package dictionary

type Word struct {
	WordID        uint   `gorm:"primarykey"`
	Language      string `gorm:"column:lang"`
	Lemma         string
	PartOfSpeech  string `gorm:"column:pos"`
	Pronunciation string `gorm:"column:pron"`
}

func (Word) TableName() string {
	return "word"
}
