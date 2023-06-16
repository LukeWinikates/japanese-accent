package database

type Label string

type Labels []Label

func (s Clip) HasLabel(label Label) bool {
	for _, s := range s.Labels {
		if label == s {
			return true
		}
	}
	return false
}
