import React from 'react';

import {useReactMediaRecorder} from "react-media-recorder";
import {CircularProgress, Grid, IconButton, makeStyles} from "@material-ui/core";
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import StopIcon from '@material-ui/icons/Stop';

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


export declare type AudioRecording = {
  blob: Blob,
  blobUrl: string,
  timestamp: Date,
}

export declare type RecorderProps = {
  beforeRecord: () => void
  onNewRecording: (newRecording: AudioRecording) => void
};

export const Recorder = (recorderProps: RecorderProps) => {
  const classes = useStyles();
  const {
    status,
    startRecording,
    stopRecording,
  } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl: string, blob: Blob) => {
      recorderProps.beforeRecord();
      let newAudioRecording = {blobUrl, blob, timestamp: new Date()};
      recorderProps.onNewRecording(newAudioRecording);
    }
  });

  const toggle = () => {
    if (status === 'recording') {
      stopRecording();
    } else {
      recorderProps.beforeRecord();
      startRecording();
    }
  };

  const RecordStopButton = status === 'recording' ? StopIcon : RadioButtonCheckedIcon;
  return (
    <Grid container alignItems="center">
      <Grid item xs={3}>
        <div className={classes.iconButtonWrapper}>
          {status === 'recording' &&
          <CircularProgress size={40} color="secondary" className={classes.iconButtonProgress}/>}
          <IconButton onClick={toggle} color={status === 'recording' ? "secondary" : "primary"}>
            <RecordStopButton fontSize="large"/>
          </IconButton>
        </div>
      </Grid>
      <Grid item xs={9}>
      </Grid>
    </Grid>
  );
};
