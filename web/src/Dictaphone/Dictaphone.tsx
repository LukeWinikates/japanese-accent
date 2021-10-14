import {Button, Grid, makeStyles, Typography} from "@material-ui/core";
import {DummyPlayer, Player} from "./Player";
import {AudioRecording, Recorder} from "./Recorder";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import React, {useEffect, useState} from "react";
import {Activity, Segment} from "../App/api";
import SkipNextIcon from '@material-ui/icons/SkipNext';
import {SuzukiButton} from "../VocabularyPractice/SuzukiButton";
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import AddIcon from '@material-ui/icons/Add';
import useFetch from "use-http";
import {RawMoraSVG} from "../VocabularyPractice/MoraSVG";

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

declare type Action = "PlaySegment" | "Record" | "PlayRecording";

export const Dictaphone = ({videoId, segment, setSegmentByIndex, segmentIndex, lastSegmentIndex}: DictaphoneProps) => {
  const [currentRecording, setCurrentRecording] = useState<AudioRecording | null>(null);
  const [segmentIsPlaying, setSegmentIsPlaying] = useState<boolean>(false);
  const [recordingIsPlaying, setRecordingIsPlaying] = useState<boolean>(false);
  const [actionQueue, setActionQueue] = useState<Action[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const {post} = useFetch(
    '/api/boosts');

  const {post: recordActivity} = useFetch<Activity>(
    '/api/activity');

  const {post: fetchOJAD} = useFetch<Activity>(
    '/api/segments');

  function saveRecording(recording: AudioRecording) {
    let newRecording = {...recording};
    setCurrentRecording(newRecording);
    setRecordingIsPlaying(true);
  }

  useEffect(() => {
    setCurrentRecording(null);
    setActionQueue([]);
  }, [segment])

  function audioUrl() {
    return `/media/audio/${videoId}` + (segment ? `#t=${segment.start / 1000},${segment.end / 1000}` : "");
  }

  function pauseAll() {
    document.querySelectorAll("audio").forEach(a => a.pause());
  }

  function practice() {
    pauseAll();
    recordActivity({
      segmentId: segment.uuid,
      activityType: "PracticeStart"
    });
    setActionQueue(["PlaySegment", "Record", "PlaySegment"])
    setSegmentIsPlaying(true);
  }

  function segmentPlaybackEnded() {
    setSegmentIsPlaying(false);
    if (actionQueue[0] === "PlaySegment") {
      const [, ...newActionQueue] = actionQueue;
      setActionQueue(newActionQueue);
      startAction(newActionQueue[0]);
    }
  }

  function startAction(action: Action) {
    switch (action) {
      case "PlaySegment":
        setRecordingIsPlaying(false);
        setIsRecording(false);
        setSegmentIsPlaying(true);
        break;
      case "Record":
        setSegmentIsPlaying(false);
        setRecordingIsPlaying(false);
        setIsRecording(true);
        break
      case "PlayRecording":
        setIsRecording(false);
        setSegmentIsPlaying(false);
        setRecordingIsPlaying(true);
        break;
    }
  }

  function recordingPlaybackEnded() {
    setRecordingIsPlaying(false);
    if (actionQueue[0] === "Record" || actionQueue[0] === "PlayRecording") {
      const [, ...newActionQueue] = actionQueue;
      setActionQueue(newActionQueue);
      startAction(newActionQueue[0]);
    }
  }

  const classes = useStyles();

  function boostCurrentSegment() {
    post({segmentId: segment.uuid})
  }

  function fetchOJADPronunciation() {
    fetchOJAD(`${segment.uuid}/pitches`)
  }

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
      <Grid container item xs={12} spacing={1} justify="space-between">
        <Grid container item xs={10} spacing={2}>
          {segment.pitch &&
          <RawMoraSVG morae={segment.pitch.morae.split(' ')} pattern={segment.pitch.pattern}/>
          }
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
                      playing={recordingIsPlaying}
                      onPlayerStateChanged={setRecordingIsPlaying}
                      onPlaybackEnded={recordingPlaybackEnded}
                      duration="auto"/>
          }
        </Grid>
      </Grid>

      <Grid container item xs={12} justify="flex-end">

        {!segment.pitch &&
        <Grid item xs={2}>
          <Button onClick={fetchOJADPronunciation}>
            Fetch pronunciation
          </Button>
        </Grid>
        }
        <Grid item xs={2}>
          <SuzukiButton text="Open in Suzuki-kun" items={[segment?.text]}/>
        </Grid>
        <Grid container item xs={2}>
          <Recorder
            recording={isRecording}
            onRecordingChange={setIsRecording}
            beforeRecord={pauseAll}
            onNewRecording={saveRecording}
          />
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
          <Button onClick={boostCurrentSegment}
                  endIcon={<AddIcon/>}>
            Boost
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