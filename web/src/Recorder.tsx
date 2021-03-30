import React, {useRef, useState} from 'react';

import {useReactMediaRecorder} from "react-media-recorder";
import {Button, Card} from "@material-ui/core";
import {Pagination} from '@material-ui/lab';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
// import StopIcon from '@material-ui/icons/Stop';
// import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CardContent from "@material-ui/core/CardContent";

declare type AudioRecording = {
  blob: Blob,
  blobUrl: string,
  timestamp: Date,
}

export const Recorder = () => {
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [page, setPage] = useState(recordings.length > 0 ? recordings.length : null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const handlePageChange = (event: any, page: number) => {
    audioRef.current?.pause();
    setPage(page);
  };

  const {
    status,
    startRecording,
    stopRecording,
  } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl: string, blob: Blob) => {
      setRecordings([...recordings, {blobUrl, blob, timestamp: new Date()}]);
      audioRef.current?.play();
    }
  });

  const toggle = () => {
    if (status === 'recording') {
      stopRecording();
    } else {
      audioRef.current?.pause();
      startRecording();
    }
  };

  const effectivePage = page ? page : recordings.length;
  const currentRecording = recordings[effectivePage - 1];
  const hasRecordings = recordings.length > 0;

  return (
    <Card>
      <CardContent>
        <Button onClick={toggle} color="default" variant="outlined" startIcon={<RadioButtonCheckedIcon/>}>
          {status !== 'recording' ? "Record" : "Stop"}
        </Button>
        {/*<Button color="default" variant="outlined" onClick={stopRecording}>*/}
        {/*  <StopIcon/>*/}
        {/*  <PlayArrowIcon></PlayArrowIcon>*/}
        {/*  Stop Recording & Play*/}
        {/*</Button>*/}
        {hasRecordings ? <>
          <div>
            <audio ref={audioRef} src={currentRecording.blobUrl || ""} controls={true}/>
            <div>
              {currentRecording.timestamp.toLocaleString()}
            </div>
          </div>
          <Pagination count={recordings.length} page={page || recordings.length} siblingCount={2} size="small"
                      onChange={handlePageChange}/>
        </> : <></>}
      </CardContent>
    </Card>
  );
};