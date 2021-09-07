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

func (link Link) VideoID() string {
	return strings.Split(link.URL, "=")[1]
}

type Category struct {
	Name       string `json:"name"`
	Tag        string
	Notes      string
	Words      []core.Word
	Categories []Category `json:"categories"`
}

type WordList struct {
	Categories []Category
	Media      []Link
}

func Parse(text string) (WordList, error) {
	categories := make([]Category, 0)
	media := make([]Link, 0)
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
			link, err := linkFromLine(linkText)
			if err == nil {
				link.Text = strings.ReplaceAll(category.Name, "#", "")
				media = append(media, link)
			}

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
		Media:      media,
	}

	return words, nil
}

func newCategory() *Category {
	return &Category{
		Categories: []Category{},
		Words:      []core.Word{},
	}
}

func linkFromLine(line string) (Link, error) {
	sp := strings.Split(line, " ")
	linkText := sp[0]

	if !strings.Contains(linkText, "=") {
		fmt.Println("bad url: " + line)
		fmt.Println("bad linkText: " + linkText)
		return Link{}, fmt.Errorf("invalid URL")
	}

	if len(sp) > 1 {
		linkText = sp[1]
	}
	return Link{
		Text: linkText,
		URL:  sp[0],
	}, nil
}

func wordFromLine(line string) core.Word {
	segments := strings.Split(line, " ")
	if len(segments) > 1 {
		maybeAccentMora, err := strconv.Atoi(segments[len(segments)-1])
		var moraAnalysis *core.MoraAnalysis
		text := segments[0]
		furigana := segments[0]

		if err == nil {
			moraAnalysis = &core.MoraAnalysis{
				AccentMora: maybeAccentMora,
			}
		}

		if len(segments) == 3 {
			furigana = segments[1]
		}

		return core.Word{
			Text:         text,
			Furigana:     furigana,
			MoraAnalysis: moraAnalysis,
		}
	}

	return core.Word{
		Text:         line,
		Furigana:     line,
		MoraAnalysis: nil,
	}
}
