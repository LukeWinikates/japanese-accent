# Japanese Accent Study Tools

## Introduction

This git repository contains scripts and tools for making it easier to efficiently study Japanese pitch accent.

## How-To

run the dictaphone:

From the terminal, run `yarn server`, and then click one of the urls the pops up. 

## Feature Backlog
* Practicing with Dictaphone
    * [ ] show a page for a given 'practice' item (e.g. currently わにわにのおふろ)
    * [ ] save files to server as they go
        * binary contents, unique id, date
        * [ ] binary persistence to a local disk
            * ~~[ ] (use minio for now?)~~
            * [] make a data directory (what's a good convention for this?)  
    * [ ] implement UI from sketches
        * ![ui sketch](gh-assets/2021-03-08-dictaphone-interactions.png)
        * [ ] react
        * [ ] typescript
        * [ ] just the landing page for now, and can hardcode a single practice context at first 
* [ ] import words from Japanese by Renzo flashcards, look up their pitch accent pattern:
    * [ ] via a standard dictionary, like the MacOS one or an online one
    * [ ] via generating a url to Forvo (possibly checking to see if it's a word there)
    * [ ] present this list as HTML -> can just generate via template for now?
    * [ ] export groups of words to suzuki-kun?
* Dictaphone
    * [ ] show a "record" button next to each word
    * [ ] record and store multiple recordings - e.g. "save and record another" "discard and record another" 
* [ ] open a word in suzuki-kun
* [ ] open a sound sample from sound sample website (Forvo)
* [ ] provide automatic grouping of words by mora-count and part of speech, and/or pitch pattern
* [ ] automatically open a word in a dictionary that provides pitch accent
* [ ] *OR* automatically draw pitch accent diacritics over the word
* [ ] provide a voice recording and playback feature (can we analyze pitch?)
    * [ ] use https://www.npmjs.com/package/react-media-recorder

## Chore Backlog

* [ ] set up yarn, typescript, and react
* [ ] set up golang project structure
* [ ] set up Brewfile? (if we're using minio)

## Decisions
* [x] Deploy to Heroku using their Container runtime
* [x] Backend language: Golang
    * [X] golang?
        * fast
        * easy cross-compilation
        * I use it at work
    * [ ] python?
        * anki uses it
        * I like it
        * not as familiar with it personally, would have to learn a whole web stack
        * potentially harder distribution story
    * [ ] node?
        * typescript
        * just not as inspired by the choice
        * no particular advantages for library use or otherwise, at this point
    * [ ] ruby?
        * I know it well
        * don't really want to use rails

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
* MacOS path to the japanese dictionary with accent information: tree `/System/Library/AssetsV2/com_apple_MobileAsset_DictionaryServices_dictionaryOSX/696aefd46a36296fe1614da8660175a7c5f15482.asset`
    *  only available to OSX users, but could write a script to generate personal flashcards from this
    
### 2021-03-6

* links about scripting MacOS dictionary access locally:
    * [ ] various terminal and python-based solutions: https://apple.stackexchange.com/questions/90040/look-up-a-word-in-dictionary-app-in-terminal
    * [ ] https://github.com/mattt/DictionaryKit
    * [ ] https://nshipster.com/dictionary-services/
* spectrogram library: https://www.npmjs.com/package/spectrogram