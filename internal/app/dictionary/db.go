package dictionary

type Word struct {
	WordID        uint   `gorm:"column:wordid;primarykey"`
	Language      string `gorm:"column:lang"`
	Lemma         string
	PartOfSpeech  string  `gorm:"column:pos"`
	Pronunciation string  `gorm:"column:pron"`
	Senses        []Sense `gorm:"foreignKey:WordID"`
}

func (Word) TableName() string {
	return "word"
}

// CREATE TABLE "synset" (
//
//	"synset"	text,
//	"pos"	text,
//	"name"	text,
//	"src"	text
//
// );
type SynonymSet struct {
	ID           string `gorm:"column:synset"`
	PartOfSpeech string `gorm:"column:pos"`
	Name         string `gorm:"column:name"`
	Source       string `gorm:"column:src"`
}

func (SynonymSet) TableName() string {
	return "synset"
}

//CREATE TABLE synset_def (synset text,
//lang text,
//def text,
//sid text)

type Definition struct {
	SynsetID   string `gorm:"column:synset"`
	Lang       string `gorm:"column:lang"`
	Definition string `gorm:"column:def"`
	SenseID    string `gorm:"column:sid"`
}

func (Definition) TableName() string {
	return "synset_def"
}

//CREATE TABLE sense (synset text,
//                          wordid integer,
//                          lang text,
//                          rank text,
//                          lexid integer,
//			  freq integer,
//                          src text)
// has 1 word
// has 1 synset

type Sense struct {
	SynsetID    string       `gorm:"column:synset"`
	WordID      uint         `gorm:"column:wordid"`
	Language    string       `gorm:"column:lang"`
	Rank        uint         `gorm:"column:rank"`
	LexID       uint         `gorm:"column:lexid"`
	Frequency   uint         `gorm:"column:freq"`
	Source      string       `gorm:"column:src"`
	Definitions []Definition `gorm:"foreignKey:SynsetID;references:SynsetID"`
}

func (Sense) TableName() string {
	return "sense"
}

//CREATE TABLE synset_ex (synset text,
//lang text,
//def text,
//sid text)

//CREATE TABLE variant (varid integer primary key,
//                          wordid integer,
//                          lang text,
//                          lemma text,
//                          vartype text)
