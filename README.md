# Japanese Accent Study Tools

## Introduction

This git repository contains scripts and tools for making it easier to efficiently study Japanese pitch accent.

## Development

* install go
* install node/nvm/yarn
* install air
* install make

--------


## Current work:
* New Editor Experience
  * improvements to VTT import
    * interactive importer
    * automatically collapse zero-duration ones
    * allow opting out of VTT import
  * alternative segment editor concept
    * positioning splits within the audio
      * get duration from browser audio api
      * generate waveform without playing back?
      * dragging to position "splits"
      * enter full text, then split text into chunks

* Practice Experience
  * keyboard shortcuts for the main dictaphone interaction 
  * generating UI feedback sounds:
    * https://modernweb.com/creating-sound-web-audio-api-oscillators/
  * automatically finish recording after a certain amount of time has passed and the audio falls silent

* Individual Words
  * using Forvo api to find pronunciations for individual words
    * entering Forvo API key; enabling settings

* Navigation
  * Revamp of AppDrawer:
      * priority-based ordering for recently added videos (based on last activity date)
      * Remove category pages for now?
  * Revamp of Home Page:
      * Recently created playlists, top videos
          * possibly spotify-style horizontal lists, rather than vertical?
  * Filtering videos by "ready" state    

* Spectrograph
  * figure out how to do a spectrograph visualization 

* Editing Videos
  * batch delete segments? 

* Create pracitce recordings for on the go
  * generate MP3 and put it in a specified sharing directory

* Tech Enhancements
  * Fix typesafety of golang route parameters?
  * Chore: database cleanup
  * introduce a version number that monotonically increases and can be used to invalidate the caches on pages when needed

* Playlists
  * maybe instead of "quick 10" interaction, we show highlighted items based on boosting, and have a button to start a playlist/session from those

* "Boosting"
  * add an automated "smart" study list consisting of "boosted" clips 
  * query uses boosts, inclusion in other playlists, and recent study time
  * how do we indicate "I'm satisfied" with my practicing for now?
    * "un"-boosting?

* Pitch Indicator
  * allow manual editing 

* Exporting
    * Anki deck
    * Flat file
    * Audio practice file
    * share with teacher
    * Japanese app (plus notes for pronunciation)
  
* Importing
  * word lists from Japanese by Renzo? 

* Icebox
    * Batch requesting of pronunciations
    * Improve rendering of pronunciations in Dictaphone
        * Add OJAD attribution



## Redesign Ideas
* allow tagging of videos, segments, words, word lists
* what is the future of hardcoded word lists?
* add "notes" to different items?
* consider a "playlist" analogy for communicating about queueing the study entries?
* adding new words to quick-study, using FAB
    * implies moving data model from text file into DB
    * possibly change parsing logic into 'import/export' logic?
    * allow pasting word lists


## Feature Backlog
* [ ] add particle attachment indicator (default to ga for adjectives, yo for verbs? are the attachment rules the same?)

* Scaffold the UI
    * [ ] navigation 'drawer'
        * [ ] user-defined 'topics' with optional groupings
        * [ ] system-generated groupings
            * [ ] heiban/odaka/atamadaka/nakadaka
            * [ ] parts of speech
            * [ ] \# of mora
    * [ ] user-defined 'practice items'
        * [ ] name (click to edit)
        * [ ] description + resource links (markdown text, links open in a new tab, click to edit)
        * [ ] stats about last time practiced
    * [ ] pitch indicator
        * [ ] allow manual entry?
        * [ ] pull from macOS dictionary if available
        * [ ] pull from suzuki-kun if available (for now, click a button)
    * [ ] external links
        * [x] suzuki-kun
        * [x] Forvo
        * [ ] macOS dictionary (if on macOS)
    * [ ] dictaphone
        * [x] click to record
        * [ ] when in record mode, can stop, stop and play, or stop and trash
        * [ ] in stopped mode with a recording, can see the latest recording or navigate back through a list of older ones
        * [ ] possibly can star 'good' recordings
        * [ ] can see a spectrograph of recording
    * [ ] some notion of progress tracking/study plan
        * [ ] frequency of desired study
        * [ ] click through a wizard, ask quesitons to drive out frequency/weight to give different categories
        * [ ] randomly mix in different sets - "heiban i adjectives", "body nouns", etc

* Dictaphone
    * [ ] show a "record" button next to each word
    * [ ] record and store multiple recordings - e.g. "save and record another" "discard and record another" 
* [ ] provide automatic grouping of words by mora-count and part of speech, and/or pitch pattern
* [ ] automatically open a word in a dictionary that provides pitch accent
* [ ] *OR* automatically draw pitch accent diacritics over the word

