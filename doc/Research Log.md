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

### 2021-04-01

I've been building up a study list for myself in a text file, using mostly markdown syntax. I'm wondering what it'll take to parse that into a form that can be persisted to the DB and round-tripped back to editable form for the user, but maybe that's an unrealistic goal:

* [ ] https://github.com/yuin/goldmark

Also looking at how to do http in the react app along with hooks:

* [x] https://github.com/ava/use-http


### 2021-04-13

Looking into calling macOS dictionary services from go:

* https://golang.org/cmd/cgo/
* https://stackoverflow.com/questions/41264945/how-to-use-macos-os-x-frameworks-in-go/41264946
* https://github.com/NSHipster/DictionaryKit/blob/main/DictionaryKit/TTTDictionary.m
* https://nshipster.com/dictionary-services/
* https://apple.stackexchange.com/questions/90040/look-up-a-word-in-dictionary-app-in-terminal

### 2021-04-16
* https://github.com/ikawaha/kagome

### 2021-04-23
* https://michalzalecki.com/generate-unique-id-in-the-browser-without-a-library/
* https://react-query.tanstack.com/

### 2021-05-10
* youtube-dl is great, but embedding python and shelling out to the command line sounds like a pain. Given that we're only using it to download from youtube, I wonder if we can port some pieces of it to golang (seems like it should be easy)