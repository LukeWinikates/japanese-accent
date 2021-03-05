# Japanese Accent Study Tools

## Introduction

This git repository contains scripts and tools for making it easier to efficiently study Japanese pitch accent.

## Feature Backlog

* [ ] show a list of words
* [ ] open a word in suzuki-kun
* [ ] open a sound sample from sound sample website
* [ ] provide automatic grouping of words by mora-count and part of speech, and/or pitch pattern
* [ ] automatically open a word in a dictionary that provides pitch accent
* [ ] *OR* automatically draw pitch accent diacritics over the word
* [ ] provide a voice recording and playback feature (can we analyze pitch?)
    * [ ] use https://www.npmjs.com/package/react-media-recorder

## Chore Backlog
* [ ] set up yarn, typescript, and react
* [ ] consider deployment options
* [ ] use material-ui?


## Research Log:

### 2021-03-02

* downloaded Dogen's Anki deck, which is great. Exporting to Anki might be a reasonable thing to do.
* anki decks are redistributed as .apkg, which is a renamed zipfile:
    * embedded media (integer filenames like `1` or `215`)
    * a manifest file in json format (`media`)
    * a sqlite database dump `collection.anki2`
* a lot of Anki's code is available as a python library that can be `pip` installed
* Could potentially mash these up in some way - generate Anki cards from personal word lists, for example.

### 2021-03-05

* since MacOS's voice memo app is a little broken, I downloaded a different thing for now - making a dictaphone is still the eventual goal
* looked for open-source dictionaries, but couldn't find any that included accent information
* so, no clear stories about how to provide accent information in FOSS software, which is sad
* can use edict or other open-source dictionaries for part of speech tagging, potentially
* perhaps automation for - I have a list, iterate over it, let's get parts of speech and accent patterns and make flashcards
