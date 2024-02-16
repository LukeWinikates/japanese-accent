import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Stack, TextField} from "@mui/material";


export const PitchContourPage = () => {
  const audioRef = useRef<HTMLAudioElement>(null!);
  const [data, setData] = useState<Uint8Array[]>([]);

  const capturePitch = (analyzer: AnalyserNode) => {
    return () => {
      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyzer.getByteTimeDomainData(dataArray);
      setData([...data, dataArray])
      console.log(dataArray)
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
      <audio ref={audioRef} onPlaying={startCapture} src="/media/audio/ewb7EpYMew0#t=0.25,2.18" controls={true}/>
    </Stack>
  );
};
