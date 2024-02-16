import React, {useCallback, useEffect, useRef, useState} from "react";
import {Stack} from "@mui/material";

// https://stackoverflow.com/questions/75063715/using-the-web-audio-api-to-analyze-a-song-without-playing
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_AudioWorklet

// on load, create an offline context and analyze the pitch
// then we can make a graph of the fundamental frequency

export const PitchContourPage = () => {
  const src="/media/audio/ewb7EpYMew0#t=0.25,2.18"
  const audioRef = useRef<HTMLAudioElement>(null!);
  const [data, setData] = useState<Uint8Array[]>([]);

  const capturePitch = (analyzer: AnalyserNode) => {
    return () => {
      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyzer.getByteTimeDomainData(dataArray);
      setData([...data, dataArray])
      requestAnimationFrame(capturePitch(analyzer))
    }
  }

  const startCapture= useCallback(() => {
    if (audioRef.current) {
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioCtx.destination)
      analyser.fftSize = 2048;

      requestAnimationFrame(capturePitch(analyser));

    }
  },[])

  useEffect(()=>{
    // need to implement https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests
    // https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext#examples
    // Range: bytes=0-1023
    fetch(src, {headers: {}})
      .then((response) => response.arrayBuffer())
  }, [])

  // useEffect(() => {
  //   if (audioRef.current) {
  //     const audioCtx = new AudioContext();
  //     const analyser = audioCtx.createAnalyser();
  //     const source = audioCtx.createMediaElementSource(audioRef.current);
  //     source.connect(analyser);
  //     analyser.connect(audioCtx.destination)
  //     analyser.fftSize = 2048;
  //
  //     requestAnimationFrame(capturePitch(analyser));
  //
  //   }
  // }, [])

  return (
    <Stack>
      <audio
        ref={audioRef}
        onPlaying={startCapture}
        src="/media/audio/ewb7EpYMew0#t=0.25,2.18"
        controls={true}/>
    </Stack>
  );
};
