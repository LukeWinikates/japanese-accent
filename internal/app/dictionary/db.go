package dictionary

type Word struct {
	WordID        uint   `gorm:"primarykey"` // primary key
	Language      string // "lang"
	Lemma         string //
	PartOfSpeech  string // "pos"
	Pronunciation string // "pron"
}
