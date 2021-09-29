import React, {useEffect} from 'react';

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
  recording: boolean
  onRecordingChange: (recording: boolean) => void
  onNewRecording: (newRecording: AudioRecording) => void
};

export const Recorder = ({beforeRecord, onNewRecording, recording, onRecordingChange}: RecorderProps) => {
  const classes = useStyles();
  const {
    status,
    startRecording,
    stopRecording,
  } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl: string, blob: Blob) => {
      beforeRecord();
      let newAudioRecording = {blobUrl, blob, timestamp: new Date()};
      onNewRecording(newAudioRecording);
    }
  });

  console.log("recorder status: ", status);

  useEffect(() => {
    if (recording && (status === 'stopped' || status === 'idle')) {
      beforeRecord();
      startRecording();
    }
    if (!recording && status === 'recording') {
      stopRecording();
    }
  }, [recording])

  const toggle = () => {
    onRecordingChange(!recording);
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
