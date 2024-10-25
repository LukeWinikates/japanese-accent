import {Button, Grid, Typography} from "@mui/material";
import {Player, PlayerSkeleton} from "./Player";
import {AudioRecording, Recorder} from "./Recorder";
import React, {useCallback, useEffect, useState} from "react";
import {ActivityPostBody, Audio, BoostPostBody, Clip} from "../api/types";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AddIcon from '@mui/icons-material/Add';
import audioURL from "../App/audioURL";
import {useBackendAPI} from "../App/useBackendAPI";
import {makeStyles} from "tss-react/mui";


const useStyles = makeStyles<void>()(() => ({
  playerControls: {
    textAlign: 'center'
  }
}));

type DictaphoneSupported = Clip | Audio

type DictaphoneParams = {
  boostPostBody?: BoostPostBody,
  activityPostBody?: ActivityPostBody,
  src: string,
  duration: { startSec: number, endSec: number } | "auto",
}

const makeParamsForClip = (clip: Clip): DictaphoneParams => {
  return {
    boostPostBody: {
      clipId: clip.uuid,
    },
    activityPostBody: {
      clipId: clip.uuid,
    },
    src: audioURL(clip),
    duration: {startSec: clip.startMS / 1000, endSec: clip.endMS / 1000},
  }
}

const makeParamsForAudio = (audio: Audio): DictaphoneParams => {
  return {
    src: audio?.url || "",
    duration: "auto",
  }
}

export declare type DictaphoneProps = {
  item: DictaphoneSupported,
};

declare type Action = "PlayClip" | "Record" | "PlayRecording";

function makeParams(item: DictaphoneSupported) {
  if ("videoUuid" in item) {
    return makeParamsForClip(item as Clip);
  }
  return makeParamsForAudio(item as Audio)
}

export function Dictaphone({item}: DictaphoneProps) {
  const {
    activityPostBody, boostPostBody, src, duration
  } = makeParams(item);
  const [currentRecording, setCurrentRecording] = useState<AudioRecording | null>(null);
  const [clipIsPlaying, setClipIsPlaying] = useState<boolean>(false);
  const [recordingIsPlaying, setRecordingIsPlaying] = useState<boolean>(false);
  const [actionQueue, setActionQueue] = useState<Action[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const api = useBackendAPI();

  const {classes} = useStyles();

  useEffect(() => {
    setCurrentRecording(null);
    setActionQueue([]);
  }, [item])

  const saveRecording = useCallback((recording: AudioRecording) => {
    const newRecording = {...recording};
    setCurrentRecording(newRecording);
    setRecordingIsPlaying(true);
  }, [setCurrentRecording, setRecordingIsPlaying]);

  const pauseAll = useCallback(() => {
    document.querySelectorAll("audio").forEach(a => a.pause());
  }, []);

  const startAction = useCallback((action: Action) => {
    switch (action) {
      case "PlayClip":
        setRecordingIsPlaying(false);
        setIsRecording(false);
        setClipIsPlaying(true);
        break;
      case "Record":
        setClipIsPlaying(false);
        setRecordingIsPlaying(false);
        setIsRecording(true);
        break
      case "PlayRecording":
        setIsRecording(false);
        setClipIsPlaying(false);
        setRecordingIsPlaying(true);
        break;
    }
  }, []);

  const practice = useCallback(() => {
    pauseAll();
    if (activityPostBody) {
      api.activity.POST(activityPostBody);
    }
    setActionQueue(["PlayClip", "Record", "PlayClip"])
    setClipIsPlaying(true);
  }, [activityPostBody, setActionQueue, setClipIsPlaying, api.activity, pauseAll]);

  const onClipPlaybackEnded = useCallback(() => {
    setClipIsPlaying(false);
    if (actionQueue[0] === "PlayClip") {
      const [, ...newActionQueue] = actionQueue;
      setActionQueue(newActionQueue);
      startAction(newActionQueue[0]);
    }
  }, [actionQueue, setActionQueue, startAction]);


  const recordingPlaybackEnded = useCallback(() => {
    setRecordingIsPlaying(false);
    if (actionQueue[0] === "Record" || actionQueue[0] === "PlayRecording") {
      const [, ...newActionQueue] = actionQueue;
      setActionQueue(newActionQueue);
      startAction(newActionQueue[0]);
    }
  }, [startAction, actionQueue]);

  const boostCurrentClip = useCallback(() => {
    if (!boostPostBody) {
      return
    }
    api.boosts.POST(boostPostBody);
  }, [boostPostBody, api.boosts]);

  return (
    <Grid container item spacing={1}>
      <Grid container item xs={6} justifyContent="center" alignItems="center" className={classes.playerControls}>
        <Grid item xs={1}>
          <Typography variant="body1">
            Native:
          </Typography>
        </Grid>
        <Grid item xs={11}>
          <Player src={src}
                  duration={duration}
                  onPlayerStateChanged={setClipIsPlaying}
                  playing={clipIsPlaying}
                  onPlaybackEnded={onClipPlaybackEnded}
          />
        </Grid>
      </Grid>
      <Grid container item xs={6} justifyContent="center" alignItems="center" className={classes.playerControls}>
        <Grid item xs={1}>
          <Typography variant="body1">
            Practice:
          </Typography>
        </Grid>
        <Grid item xs={11}>
          {
            currentRecording === null ?
              <PlayerSkeleton/> :
              <Player src={currentRecording.blobUrl}
                      playing={recordingIsPlaying}
                      onPlayerStateChanged={setRecordingIsPlaying}
                      onPlaybackEnded={recordingPlaybackEnded}
                      duration="auto"/>
          }
        </Grid>
      </Grid>

      <Grid container item xs={12} justifyContent="flex-end">
        <Grid container item xs={2}>
          <Button onClick={boostCurrentClip}
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