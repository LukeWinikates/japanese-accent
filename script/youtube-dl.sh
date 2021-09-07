#!/usr/bin/env bash

VIDEO_ID=$1


youtube-dl --write-auto-sub -k --sub-lang ja https://www.youtube.com/watch\?v\=${VIDEO_ID}