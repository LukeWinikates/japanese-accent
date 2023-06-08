import React, {useCallback, useEffect} from 'react';

import {styled} from '@mui/material/styles';

import {useReactMediaRecorder} from "react-media-recorder";
import {Button, CircularProgress} from "@mui/material";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import StopIcon from '@mui/icons-material/Stop';

const PREFIX = 'Recorder';

const classes = {
  iconButtonWrapper: `${PREFIX}-iconButtonWrapper`,
  iconButtonProgress: `${PREFIX}-iconButtonProgress`
};

const Root = styled('div')(() => ({
  [`&.${classes.iconButtonWrapper}`]: {
    position: 'relative',
  },

  [`& .${classes.iconButtonProgress}`]: {
    position: 'absolute',
    left: "calc(50% - 44px)",
    color: "white",
    zIndex: 200,
    top: "7px",
  }
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
  let onStop = useCallback((blobUrl: string, blob: Blob) => {
    beforeRecord();
    let newAudioRecording = {blobUrl, blob, timestamp: new Date()};
    onNewRecording(newAudioRecording);
  }, [beforeRecord, onNewRecording]);

  const {
    status,
    startRecording,
    stopRecording,
  } = useReactMediaRecorder({
    audio: true,
    onStop: onStop
  });

  useEffect(() => {
    if (recording && (status === 'stopped' || status === 'idle')) {
      beforeRecord();
      startRecording();
    }
    if (!recording && status === 'recording') {
      stopRecording();
    }
  }, [recording, beforeRecord, startRecording, status, stopRecording])

  const toggle = useCallback(() => {
    onRecordingChange(!recording);
  }, [onRecordingChange, recording]);

  const RecordStopButton = status === 'recording' ? StopIcon : RadioButtonCheckedIcon;
  return (
    <Root className={classes.iconButtonWrapper}>
      {status === 'recording' &&
      <CircularProgress size={22} color="secondary" className={classes.iconButtonProgress}/>}
      <Button variant="contained"
              onClick={toggle}
              color={status === 'recording' ? "secondary" : "primary"}
              startIcon={<RecordStopButton/>}>
        Record
      </Button>
    </Root>
  );
};
