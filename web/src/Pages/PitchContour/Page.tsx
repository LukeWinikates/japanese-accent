import React, {useCallback, useEffect, useRef, useState} from "react";
import {Stack} from "@mui/material";
import {indexToHz} from "../../App/frequency";

// https://stackoverflow.com/questions/75063715/using-the-web-audio-api-to-analyze-a-song-without-playing
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_AudioWorklet

// on load, create an offline context and analyze the pitch
// then we can make a graph of the fundamental frequency

export const PitchContourPage = () => {
  const src="/media/audio/ewb7EpYMew0#t=0.25,2.18"
  const audioRef = useRef<HTMLAudioElement>(null!);
  const [analyzer, setAnalyzer] = useState<AnalyserNode|undefined>();
  const [data, setData] = useState<{freq: number, db: number}[]>([]);

  useEffect(()=>{
    if(!audioRef.current) {
      return ;
    }
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioCtx.destination)
    analyser.fftSize = 2048;
    setAnalyzer(analyser)

  }, [audioRef.current])

  const capturePitch = useCallback(() => {
      const bufferLength = analyzer!.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyzer!.getByteFrequencyData(dataArray);

      let fundFreq = {freq: 0, db: 0};
      for (let i = 0; i < bufferLength; i++) {
        let val = dataArray[i];
        if (val > fundFreq.db) {
          let sampleRate = analyzer!.context.sampleRate;
          var hz = indexToHz(sampleRate, bufferLength, i)
          fundFreq = {freq: Math.round(hz), db: val}
        }
      }

      setData(prev=> {
        return [...prev, fundFreq]}
      );
  }, [data, analyzer])

  const startCapture= useCallback(() => {
      requestAnimationFrame(capturePitch);
  },[audioRef.current])


  return (
    <Stack>
      <audio
        ref={audioRef}
        onPlaying={startCapture}
        onTimeUpdate={capturePitch}
        src={src}
        controls={true}/>
      <div style={{display: "flex"}}>
        {data.map((val, idx) =>
            <div key={idx} style={{height: val.freq, flexBasis: "40px"}}>{val.freq}hz </div>)}
      </div>
    </Stack>
  );
};
