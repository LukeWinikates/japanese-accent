package parser

import (
	"bufio"
	"fmt"
	"github.com/LukeWinikates/japanese-accent/internal/app/core"
	"strings"
)

type Link struct {
	Text string
	URL  string
}

type Section struct {
	Name  string
	Tag   string
	Notes string
	Links []Link
	Words []core.Word
}

type WordList struct {
	Sections []Section
}

func Parse(text string) (*WordList, error) {
	sections := make([]Section, 0)
	section := &Section{}

	scanner := bufio.NewScanner(strings.NewReader(text))
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if strings.HasPrefix(line, "//") {
			continue
		}

		if strings.HasPrefix(line, "#") {
			if len(section.Name) > 0 {
				sections = append(sections, *section)
				section = &Section{}
			}
			section.Name = line
			continue
		}

		if strings.HasPrefix(line, "-") {
			linkText := strings.TrimLeft(line, "-")
			section.Links = append(section.Links, linkFromLine(linkText))
			continue
		}

		if strings.HasPrefix(line, "#") {
			if len(section.Name) > 0 {
				sections = append(sections, *section)
				section = &Section{}
			}
			section.Name = line
			fmt.Print(section)
			continue
		}

		if len(line) > 0 {
			section.Words = append(section.Words, wordFromLine(line))
			continue
		}

	}
	sections = append(sections, *section)

	var words = WordList{
		Sections: sections,
	}

	return &words, nil
}

func linkFromLine(line string) Link {
	sp := strings.Split(line, " ")
	linkText := sp[0]
	if len(sp) > 1 {
		linkText = sp[1]
	}
	return Link{
		Text: linkText,
		URL:  sp[0],
	}
}

func wordFromLine(line string) core.Word {
	return core.Word{
		Text: line,
	}
}
