package ojad

import "strings"

type PitchAndMoraStrings struct {
	Pitch string
	Morae string
}

func MakePitchAndMoraStrings(pitches []Pitch) PitchAndMoraStrings {
	pitchString := ""
	moraSlice := make([]string, 0)

	for _, mora := range pitches[0].Morae {
		moraSlice = append(moraSlice, mora.Mora)
		pitchString = pitchString + string(mora.HighLow[0])
	}

	moraeString := strings.Join(moraSlice, " ")
	return PitchAndMoraStrings{
		Pitch: pitchString,
		Morae: moraeString,
	}
}
