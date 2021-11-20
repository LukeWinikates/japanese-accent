package forvo

const urlFormat = "https://apifree.forvo.com/action/word-pronunciations/format/json/word/%s/id_lang_speak/76/key/%s/"

//goland:noinspection SpellCheckingInspection
type Pronunciation struct {
	Id               int    `json:"id"`
	Word             string `json:"word"`
	Original         string `json:"original"`
	AddTime          string `json:"addtime"`
	Hits             int    `json:"hits"`
	Username         string `json:"username"`
	Sex              string `json:"sex"`
	Country          string `json:"country"`
	Code             string `json:"code"`
	LangName         string `json:"langname"`
	PathMP3          string `json:"pathmp3"`
	PathOgg          string `json:"pathogg"`
	Rate             int    `json:"rate"`
	NumVotes         int    `json:"num_votes"`
	NumPositiveVotes int    `json:"num_positive_votes"`
}

type PronunciationList struct {
	Items []Pronunciation `json:"items"`
}
