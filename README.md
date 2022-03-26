# Japanese Accent Study Tools

## Introduction

This git repository contains scripts and tools for making it easier to efficiently study Japanese pitch accent.

## Development

* install go
* install node/nvm/yarn
* install air
* install make

--------

* Possibly split the card that holds pronunciation info out of the dictaphone.
  * Then, pitch-related actions and visualizations could appear in their own card and be type-specific more easily

* Change "petch pronunciations / open in Suzuku-kun" buttons to a combo button

## Current work:
* New Editor Experience
  * VTT import goes to a different table (not "segments")
  * Drag-drop 'trashcan' section for destroying unwanted segments
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

* "Video Vocabulary"
  * separate "tab" with its own player?
  * ephemeral forvo URL handling
    * need to implement read-through cache of per-word forvo pronunciations
    * remove forvo pronunciations from DB
    * pre-fetching?
  * Per phrase word linking 
  * TTL cache
  * Unified data mode for pitch patterns for phrases and words
    Maybe a unified data model for videos and other kinds of content 

* Settings Page
    * managing Forvo API key

* Practice Experience
  * keyboard shortcuts for the main dictaphone interaction 
  * generating UI feedback sounds:
    * https://modernweb.com/creating-sound-web-audio-api-oscillators/
  * automatically finish recording after a certain amount of time has passed and the audio falls silent

* Vocabulary Items
  * Videos can have associated vocabulary items. individual segments can as well. 
  * using Forvo api to find pronunciations for individual words

* Navigation
  * Revamp of AppDrawer:
      * priority-based ordering for recently added videos (based on last activity date)
      * Remove category pages for now?
  * Revamp of Home Page:
      * Recently created playlists, top videos
          * possibly spotify-style horizontal lists, rather than vertical?
      * Only show videos that are ready to practice by default.   
      * remove "word lists" here for now - these are low value     

* Spectrograph
  * figure out how to do a spectrograph visualization 

* Editing Videos
  * batch delete segments? 
  * hamburger icon for each item on the playlist - use that for delete/jump to youtube
  * open segment in youtube at the position, using `https://youtu.be/$VIDEO_ID?t=89` pattern

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
  * maybe boosting is like "queue 10 practices" - that could be a clearer call to action for that button
  * Rewrite the playlist picker query to pick newer stuff
  * Also make it query in batches and then loop until it has enough items
  * Consider rephrasing boosting as pinning


* Pitch Indicator
  * allow manual editing 

* Exporting
    * Anki deck
    * Flat file
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

