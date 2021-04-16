package parser

import (
	"bufio"
	"fmt"
	"github.com/LukeWinikates/japanese-accent/internal/app/core"
	"strconv"
	"strings"
)

type Link struct {
	Text string
	URL  string
}

type Category struct {
	Name       string `json:"name"`
	Tag        string
	Notes      string
	Links      []Link
	Words      []core.Word
	Categories []Category `json:"categories"`
}

type WordList struct {
	Categories []Category
}

func Parse(text string) (WordList, error) {
	categories := make([]Category, 0)
	category := newCategory()

	scanner := bufio.NewScanner(strings.NewReader(text))
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if strings.HasPrefix(line, "//") {
			continue
		}

		if strings.HasPrefix(line, "#") {
			if len(category.Name) > 0 {
				categories = append(categories, *category)
				category = newCategory()
			}
			category.Name = line
			continue
		}

		if strings.HasPrefix(line, "-") {
			linkText := strings.TrimLeft(line, "-")
			category.Links = append(category.Links, linkFromLine(linkText))
			continue
		}

		if strings.HasPrefix(line, "#") {
			if len(category.Name) > 0 {
				categories = append(categories, *category)
				category = &Category{}
			}
			category.Name = line
			fmt.Print(category)
			continue
		}

		if len(line) > 0 {
			category.Words = append(category.Words, wordFromLine(line))
			continue
		}

	}
	categories = append(categories, *category)

	var words = WordList{
		Categories: categories,
	}

	return words, nil
}

func newCategory() *Category {
	return &Category{
		Categories: []Category{},
		Links:      []Link{},
		Words:      []core.Word{},
	}
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
	segments := strings.Split(line, " ")
	if len(segments) > 1 {
		maybeAccentMora, err := strconv.Atoi(segments[len(segments)-1])
		accentMora := &maybeAccentMora
		text := segments[0]
		furigana := segments[0]

		if err != nil {
			accentMora = nil
		}

		if len(segments) == 3 {
			furigana = segments[1]
		}

		return core.Word{
			Text:       text,
			Furigana:   furigana,
			AccentMora: accentMora,
		}
	}

	return core.Word{
		Text:       line,
		Furigana:   line,
		AccentMora: nil,
	}

}
