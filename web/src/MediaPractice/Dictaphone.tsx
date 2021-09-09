import {Button, Grid, makeStyles, Typography} from "@material-ui/core";
import {DummyPlayer, Player} from "./Player";
import {AudioRecording, Recorder} from "./Recorder";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import React, {useEffect, useState} from "react";
import {Segment} from "../api";
import SkipNextIcon from '@material-ui/icons/SkipNext';
import {SuzukiButton} from "../VocabularyPractice/SuzukiButton";
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';

const useStyles = makeStyles(() => ({
  playerControls: {
    textAlign: 'center',
  },
}));

export declare type DictaphoneProps = {
  videoId: string
  segment: Segment
  setSegmentByIndex: (newIndex: number) => void
  segmentIndex: number
  lastSegmentIndex: number
};

export const Dictaphone = ({videoId, segment, setSegmentByIndex, segmentIndex, lastSegmentIndex}: DictaphoneProps) => {
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [currentRecording, setCurrentRecording] = useState<AudioRecording | null>(null);
  const [segmentIsPlaying, setSegmentIsPlaying] = useState<boolean>(false);
  const [recordingIsPlaying, setRecordingIsPlaying] = useState<boolean>(false);

  function saveRecording(recording: AudioRecording) {
    let newRecording = {...recording};
    setRecordings([...recordings, newRecording]);
    setCurrentRecording(newRecording);
    setRecordingIsPlaying(true);
  }

  useEffect(() => {
    setRecordings([])
    setCurrentRecording(null)
  }, [segment])

  function audioUrl() {
    return `/media/audio/${videoId}` + (segment ? `#t=${segment.start / 1000},${segment.end / 1000}` : "");
  }

  function pauseAll() {
    document.querySelectorAll("audio").forEach(a => a.pause());
  }

  function practice() {
    // 1. play current segment.
    // 2. when current segment is done, record
    // 3. when recording is done, play current segment
    // 4. when current segment is done playing, play reference

    // maybe we have an internal "playlist" state.
    var playlist = ["playing segment", "recording segment", "playing segment", "playing recording"];

  }

  function segmentPlaybackEnded() {
    // if current playist && current playlist is playing segment, advance current playlist
  }

  function recordingPlaybackEnded() {
    // if current playist && current playlist is playing recording, advance current playlist
  }

  const classes = useStyles();

  return (
    <Grid container item spacing={1}>
      <Grid container item xs={12} spacing={1} justify="space-between">
        <Grid item xs={1}>
          <Button disabled={segmentIndex === 0}
                  onClick={() => setSegmentByIndex(segmentIndex - 1)}
                  startIcon={<SkipPreviousIcon/>}>
            Previous
          </Button>
        </Grid>
        <Grid container item xs={10} spacing={2}>
          <strong style={{display: "inline-block", margin: "auto"}}>
            「{segment?.text}」
          </strong>
        </Grid>
        <Grid item xs={1}>
          <Button disabled={segmentIndex === lastSegmentIndex}
                  onClick={() => setSegmentByIndex(segmentIndex + 1)}
                  endIcon={<SkipNextIcon/>}>
            Next
          </Button>
        </Grid>
      </Grid>
      <Grid container item xs={6} justify="center" alignItems="center" className={classes.playerControls}>
        <Grid item xs={1}>
          <Typography variant="body1">
            Native:
          </Typography>
        </Grid>
        <Grid item xs={11}>
          <Player src={audioUrl()}
                  duration={{startSec: segment.start, endSec: segment.end}}
                  onPlayerStateChanged={setSegmentIsPlaying}
                  playing={segmentIsPlaying}
                  onPlaybackEnded={segmentPlaybackEnded}
                  autoplayOnChange={false}
          />
        </Grid>
      </Grid>
      <Grid container item xs={6} justify="center" alignItems="center" className={classes.playerControls}>
        <Grid item xs={1}>
          <Typography variant="body1">
            Practice:
          </Typography>
        </Grid>
        <Grid item xs={11}>
          {
            currentRecording === null ?
              <DummyPlayer/> :
              <Player src={currentRecording.blobUrl}
                      autoplayOnChange={true}
                      playing={recordingIsPlaying}
                      onPlayerStateChanged={setRecordingIsPlaying}
                      onPlaybackEnded={recordingPlaybackEnded}
                      duration="auto"/>
          }
        </Grid>
      </Grid>

      <Grid container item xs={12} justify="flex-end">
        <Grid item xs={2}>
          <SuzukiButton text="Open in Suzuki-kun" items={[segment?.text]}/>
        </Grid>
        <Grid container item xs={2}>
          <Recorder beforeRecord={pauseAll} onNewRecording={saveRecording}/>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" startIcon={<RecordVoiceOverIcon/>} onClick={practice}>
            Practice
          </Button>
        </Grid> </Grid>

      <Grid container item xs={12} justify="space-between">
        <Grid item xs={1}>
          <Button disabled={segmentIndex === 0}
                  onClick={() => setSegmentByIndex(segmentIndex - 1)}
                  startIcon={<SkipPreviousIcon/>}>
            Previous
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button disabled={segmentIndex === lastSegmentIndex}
                  onClick={() => setSegmentByIndex(segmentIndex + 1)}
                  endIcon={<SkipNextIcon/>}>
            Next
          </Button>
        </Grid>

        {/*<Button variant="contained" disabled={segmentIndex === lastSegmentIndex}*/}
        {/*        onClick={() => setSegmentByIndex(segmentIndex + 1)}*/}
        {/*        endIcon={<><SkipNextIcon/><RecordVoiceOverIcon/></>}>*/}
        {/*  Next*/}
        {/*</Button>*/}
      </Grid>
    </Grid>
  );
};