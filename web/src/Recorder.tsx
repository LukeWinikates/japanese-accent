import React, {useRef, useState} from 'react';

import {useReactMediaRecorder} from "react-media-recorder";

export const Recorder = () => {
  const [showMedia, setShowMedia] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    audio: true,
    onStop: () => {
      console.log("onstop");
      audioRef.current?.play();
    }
  });


  const toggle = () => {
    if (status === 'recording') {
      stopRecording();
      setShowMedia(true);
    }
    startRecording();
  };


  return (
    <div>
      <div>{status}</div>
      <button onClick={toggle}>{status !== 'recording' ? "start recording" : "stop recording"}</button>
      {showMedia ? <audio ref={audioRef} src={mediaBlobUrl || ""} controls={true}/> : <span>no media yet</span>}
    </div>
  );
};