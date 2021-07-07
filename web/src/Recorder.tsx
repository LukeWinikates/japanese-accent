import React, {useRef, useState} from 'react';

import {useReactMediaRecorder} from "react-media-recorder";
import {CircularProgress, Grid, IconButton, makeStyles} from "@material-ui/core";
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import StopIcon from '@material-ui/icons/Stop';
// import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const useStyles = makeStyles((theme) => ({
  iconButtonWrapper: {
    // margin: theme.spacing(1),
    position: 'relative',
  },
  iconButtonProgress: {
    position: 'absolute',
    left: "calc(50% - 20px)",
    top: "9px",
  },
}));


declare type AudioRecording = {
  blob: Blob,
  blobUrl: string,
  timestamp: Date,
}

export declare type RecorderProps = {
  beforeRecord: () => void
  onProgress?: (state: { seconds: number }) => void
};

export const Recorder = (recorderProps: RecorderProps) => {
  const classes = useStyles();
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [page, setPage] = useState(recordings.length > 0 ? recordings.length : null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    status,
    startRecording,
    stopRecording,
  } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl: string, blob: Blob) => {
      console.log("onStop");
      recorderProps.beforeRecord();
      setRecordings([...recordings, {blobUrl, blob, timestamp: new Date()}]);
      audioRef.current?.play();
    }
  });

  const toggle = () => {
    if (status === 'recording') {
      stopRecording();
    } else {
      recorderProps.beforeRecord();
      audioRef.current?.pause();
      startRecording();
    }
  };

  const effectivePage = page ? page : recordings.length;
  const currentRecording = recordings[effectivePage - 1];
  const hasRecordings = recordings.length > 0;
  const RecordStopButton = status === 'recording' ? StopIcon : RadioButtonCheckedIcon;
  return (
    <Grid container alignItems="center">
      <Grid item xs={3}>
        <div className={classes.iconButtonWrapper}>
          {status === 'recording' && <CircularProgress size={40} color="secondary" className={classes.iconButtonProgress}/>}
          <IconButton onClick={toggle} color={status === 'recording' ? "secondary" : "primary"}>
            <RecordStopButton fontSize="large"/>
          </IconButton>
        </div>
      </Grid>
      <Grid item xs={9}>
      </Grid>
      {hasRecordings ? <>
        <audio ref={audioRef} src={currentRecording.blobUrl || ""} controls={false}/>
      </> : <></>}
    </Grid>
  );
};