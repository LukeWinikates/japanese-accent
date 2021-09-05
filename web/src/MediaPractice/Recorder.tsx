import React from 'react';

import {useReactMediaRecorder} from "react-media-recorder";
import {Button, CircularProgress, makeStyles} from "@material-ui/core";
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import StopIcon from '@material-ui/icons/Stop';

const useStyles = makeStyles(() => ({
  iconButtonWrapper: {
    position: 'relative',
  },
  iconButtonProgress: {
    position: 'absolute',
    left: "calc(50% - 44px)",
    color: "white",
    zIndex: 200,
    top: "7px",
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
    <div className={classes.iconButtonWrapper}>
      {status === 'recording' &&
      <CircularProgress size={22} color="secondary" className={classes.iconButtonProgress}/>}
      <Button variant="contained"
              onClick={toggle}
              color={status === 'recording' ? "secondary" : "primary"}
              startIcon={<RecordStopButton/>}>
        Record
      </Button>
    </div>
  );
};
