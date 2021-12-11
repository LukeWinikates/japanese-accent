import {Button, Grid, makeStyles, Typography} from "@material-ui/core";
import {DummyPlayer, Player} from "./Player";
import {AudioRecording, Recorder} from "./Recorder";
import React, {useEffect, useState} from "react";
import {Activity, Audio, Segment} from "../App/api";
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import AddIcon from '@material-ui/icons/Add';
import useFetch, {CachePolicies} from "use-http";
import {useServerInteractionHistory} from "../Layout/useServerInteractionHistory";
import audioURL from "../App/audioURL";

const useStyles = makeStyles(() => ({
  playerControls: {
    textAlign: 'center',
  },
}));

type DictaphoneSupported = Segment  | Audio

type DictaphoneParams = {
  boostPostBody: any,
  activityPostBody: any,
  src: string,
  duration: {startSec: number, endSec: number} | "auto",
}

const makeParamsForSegment = (segment: Segment): DictaphoneParams => {
  return {
    boostPostBody: {
      segment
    },
    activityPostBody: {
      segmentId: segment.uuid,
    },
    src: audioURL(segment),
    duration: {startSec: segment.start, endSec: segment.end},
  }
}

const makeParamsForAudio = (audio: Audio): DictaphoneParams => {
  return {
    boostPostBody: {
      // wordId: analysis.wordId
    },
    activityPostBody: {
      // wordId: analysis.wordId
    },
    src: audio?.url || "",
    duration: "auto",
  }
}

export declare type DictaphoneProps = {
  item: DictaphoneSupported,
};

declare type Action = "PlaySegment" | "Record" | "PlayRecording";

function makeParams(item: DictaphoneSupported) {
  if ("videoUuid" in item) {
    let segment = item as Segment;
    return makeParamsForSegment(segment);
  }
  console.log("got here!")
  return makeParamsForAudio(item as Audio)
}

export function Dictaphone({item}: DictaphoneProps) {
  const {
    activityPostBody, boostPostBody, src, duration
  } = makeParams(item);
  const [currentRecording, setCurrentRecording] = useState<AudioRecording | null>(null);
  const [segmentIsPlaying, setSegmentIsPlaying] = useState<boolean>(false);
  const [recordingIsPlaying, setRecordingIsPlaying] = useState<boolean>(false);
  const [actionQueue, setActionQueue] = useState<Action[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const {post} = useFetch(
    '/api/boosts', {cachePolicy:CachePolicies.NO_CACHE});

  const {post: recordActivity} = useFetch<Activity>(
    '/api/activity', {cachePolicy:CachePolicies.NO_CACHE});

  const {logError} = useServerInteractionHistory();

  function saveRecording(recording: AudioRecording) {
    let newRecording = {...recording};
    setCurrentRecording(newRecording);
    setRecordingIsPlaying(true);
  }

  useEffect(() => {
    setCurrentRecording(null);
    setActionQueue([]);
  }, [item])

  function pauseAll() {
    document.querySelectorAll("audio").forEach(a => a.pause());
  }

  function practice() {
    pauseAll();
    recordActivity({
      ...activityPostBody,
      activityType: "PracticeStart"
    }).catch(e => logError(e, "warning"));
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
    post({
        ...boostPostBody
      }
    ).catch(e => logError(e, "warning"))
  }

  return (
    <Grid container item spacing={1}>
      <Grid container item xs={6} justify="center" alignItems="center" className={classes.playerControls}>
        <Grid item xs={1}>
          <Typography variant="body1">
            Native:
          </Typography>
        </Grid>
        <Grid item xs={11}>
          <Player src={src}
                  duration={duration}
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
        <Grid container item xs={2}>
          <Button onClick={boostCurrentSegment}
                  startIcon={<AddIcon/>}>
            Boost
          </Button>
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
    </Grid>
  );
}