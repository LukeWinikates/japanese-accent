import React, {useCallback, useEffect, useRef, useState} from "react";
import {Stack} from "@mui/material";
/* eslint-disable jsx-a11y/media-has-caption */

// https://stackoverflow.com/questions/75063715/using-the-web-audio-api-to-analyze-a-song-without-playing
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_AudioWorklet

// on load, create an offline context and analyze the pitch
// then we can make a graph of the fundamental frequency

export const PitchContourPage = () => {
  const src = "/media/audio/ewb7EpYMew0#t=0.25,2.18"
  const audioRef = useRef<HTMLAudioElement>(null!);
  const [data, setData] = useState<string[]>([])
  const [sampleRate, setSampleRate] = useState(0);
  const [pitchContourWorkletNode, setPitchContourWorkletNode] = useState<null | AudioWorkletNode>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    const audioCtx = new AudioContext();
    setSampleRate(audioCtx.sampleRate);
    const source = audioCtx.createMediaElementSource(audioRef.current);
    audioCtx.audioWorklet.addModule("pitch-contour-processor.js").then(r => {
      const pitchContourNode = new AudioWorkletNode(
        audioCtx,
        "pitch-contour-processor",
      );
      source.connect(pitchContourNode);
      pitchContourNode.connect(audioCtx.destination)
      pitchContourNode.port.onmessage = (e: MessageEvent<string>) => {
        setData((d) => [...d, e.data])
      }
      setPitchContourWorkletNode(pitchContourNode);
    })


    // how do we want to get teh data back from the worklet?
    // the message port?
    // a callback?
    // as an output?
  }, [audioRef.current])


  const startCapturing = useCallback(() => {
      pitchContourWorkletNode!.port.postMessage("start");
    }, [pitchContourWorkletNode]
  )

  const stopCapturing = useCallback(() => {
      pitchContourWorkletNode!.port.postMessage("stop")
    }, [pitchContourWorkletNode]
  )

  const onTimeUpdate = useCallback(() => {
      console.log(audioRef.current?.currentTime)
      if ((audioRef.current?.currentTime || 0) >= 2.18) {

        pitchContourWorkletNode!.port.postMessage("stop")
      }
    }, [pitchContourWorkletNode]
  )

  return (
    <Stack>
      <audio
        ref={audioRef}
        src={src}
        onPlay={startCapturing}
        onPause={stopCapturing}
        onEnded={stopCapturing}
        onTimeUpdate={onTimeUpdate}
        controls={true}/>
      <div>
        <h3>{data.length || 0}</h3>
        {sampleRate}
        <h2>{data[0]?.length || 0}</h2>
        {data.map((val, idx) =>
          <div key={idx}>
            {val}
            {/*{val.map((b, idx) =>*/}
            {/*  <div style={{display: "inline-block", width: "30px", fontSize: "8px"}} key={idx}>{val}</div>*/}
            {/*)}*/}
          </div>
        )}
      </div>
    </Stack>
  );
};
