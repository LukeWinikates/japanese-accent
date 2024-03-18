import React, {useEffect, useRef, useState} from "react";
import {Stack} from "@mui/material";
/* eslint-disable jsx-a11y/media-has-caption */

// https://stackoverflow.com/questions/75063715/using-the-web-audio-api-to-analyze-a-song-without-playing
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_AudioWorklet

// on load, create an offline context and analyze the pitch
// then we can make a graph of the fundamental frequency

export const PitchContourPage = () => {
  const src = "/media/audio/ewb7EpYMew0#t=0.25,2.18"
  const audioRef = useRef<HTMLAudioElement>(null!);
  // const [analyzer, setAnalyzer] = useState<AnalyserNode | undefined>();
  const [data, setData] = useState<number[][]>([]);
  const [isModuleLoaded, setModuleLoaded] = useState(false);
  const [animationFrameCallback, setAnimationFrameCallback] = useState<number | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaElementSource(audioRef.current);
    audioCtx.audioWorklet.addModule("pitch-contour-processor.js").then(r=> {
      const pitchContourNode = new AudioWorkletNode(
        audioCtx,
        "pitch-contour-processor",
      );
      source.connect(pitchContourNode);
      pitchContourNode.connect(audioCtx.destination)
    })
    // const analyser = audioCtx.createAnalyser();

    // analyser.fftSize = 2048;
    // console.log({fftSize: 2048, frequencyBinCount: analyser.frequencyBinCount, sampleRate: audioCtx.sampleRate})
    // setAnalyzer(analyser)

  }, [audioRef.current, isModuleLoaded])

  // const capturePitch = useCallback(() => {
  //   const bufferLength = analyzer!.fftSize;
  //   const dataArray = new Uint8Array(bufferLength);
  //   console.log(new Date().valueOf());
  //
  //   analyzer!.getByteTimeDomainData(dataArray);
  //
  //   setData(prev => {
  //       return [...prev, Array.from(dataArray)]
  //     }
  //   );
  //   setAnimationFrameCallback(requestAnimationFrame(capturePitch));
  // }, [data, analyzer])

  // const startCapture = useCallback(() => {
  //   requestAnimationFrame(capturePitch);
  // }, [audioRef.current])
  //
  // const stopCapture = useCallback(() => {
  //   animationFrameCallback && cancelAnimationFrame(animationFrameCallback);
  //   setAnimationFrameCallback(null);
  // }, [audioRef.current, animationFrameCallback])


  return (
    <Stack>
      <audio
        ref={audioRef}
        // onPlaying={startCapture}
        // onPause={stopCapture}
        // onEnded={stopCapture}
        src={src}
        controls={true}/>
      <div>
        <h2>{data[0]?.length || 0}</h2>
        {data.map((val, idx) =>
          <div key={idx}>
            {/*{val.map((b, idx) =>*/}
            {/*  <div style={{display: "inline-block", width: "30px", fontSize: "8px"}} key={idx}>{val}</div>*/}
            {/*)}*/}
          </div>
        )}
      </div>
    </Stack>
  );
};
