import React, {useEffect, useRef, useState} from "react";
import {useTheme} from "@mui/material";
import {makeStyles} from 'tss-react/mui';
import {Waveform} from "../App/api";
import {Range} from '../App/time'
import {Loadable} from "../App/loadable";
import {Segment} from "../Pages/YouTube/Segment";
import {DrawBackground, DrawWaveform} from "./canvas";

const TOP_HEIGHT = 50;
const SCRUBBER_HEIGHT = 5;
const SCRUBBER_HANDLE_HEIGHT = 25;
const CONTAINER_HEIGHT = TOP_HEIGHT + SCRUBBER_HEIGHT + SCRUBBER_HANDLE_HEIGHT;

// TODO: memoize the load function
const useStyles = makeStyles()((theme) => ({
  playHeadTop: {
    position: "absolute",
    top: 0,
    height: TOP_HEIGHT,
    width: 2,
    backgroundColor: theme.palette.secondary.main
  },
  waveFormContainer: {
    position: "relative",
    height: CONTAINER_HEIGHT,
    overflow: "hidden"
  },
  selected: {
    backgroundColor: theme.palette.secondary.dark,
    opacity: 0.25,
  },
  timingContainer: {
    position: "relative"
  }
}));


type Props = {
  range: Range
  setRange: (r: Range) => void
  onLoadWaveform: () => Promise<Waveform>,
  onStartResizing: () => void,
  playerPositionMS: number,
}

export function ResizingWaveform({
                                   onLoadWaveform,
                                   range,
                                   playerPositionMS,
                                   setRange
                                 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasWidth, setCanvasWidth] = useState(1200)
  const theme = useTheme();
  const [waveform, setWaveform] = useState<Loadable<Waveform>>("loading")
  const [totalMS, setTotalMS] = useState<number>(0)

  const {classes} = useStyles();

  let RESIZER_PADDING_MS = 2000;

  function clamp(val: number): number {
    return Math.min(Math.max(0, val), totalMS);
  }

  const windowRange = {
    startMS: clamp(range.startMS - RESIZER_PADDING_MS),
    endMS: clamp(range.endMS + RESIZER_PADDING_MS),
  }

  useEffect(() => {
    setCanvasWidth(canvasRef.current?.parentElement?.clientWidth || 1200)
    onLoadWaveform().then(w => {
      setWaveform({data: w});
      setTotalMS(w.samples.length / w.sampleRate * 1000);
    })
  }, [onLoadWaveform])


  const backgroundColor = theme.palette.grey.A200;
  const waveformColor = theme.palette.background.default;

  useEffect(() => {
    function inRange(waveform: Waveform): number[] {
      const firstIndex = Math.round((windowRange.startMS / 1000) * waveform.sampleRate);
      const lastIndex = Math.round((windowRange.endMS / 1000) * waveform.sampleRate);
      return waveform.samples.slice(firstIndex, lastIndex)
    }

    if (waveform === "loading") {
      return;
    }
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) {
      return
    }
    const {width} = context.canvas;
    let samples = inRange(waveform.data);
    const sampleWidth = width / samples.length
    DrawBackground(context, width, TOP_HEIGHT, backgroundColor);
    DrawWaveform(context, samples, TOP_HEIGHT, sampleWidth, waveformColor);
  }, [canvasWidth, waveform, range, backgroundColor, waveformColor, windowRange.startMS, windowRange.endMS])

  const msToPctOfRange = (ms: number) => {
    const rangeLength = windowRange.endMS - windowRange.startMS;
    if (rangeLength === 0) {
      return 0
    }
    const relativeToStart = ms - windowRange.startMS;

    return (relativeToStart / rangeLength) * 100;
  }

  const msToPx = (ms: number): number => {
    // console.log("canvasWidth", canvasWidth)
    let x = msToPctOfRange(ms) * canvasWidth / 100;
    // console.log("msToPX", x);
    // console.log("rounded", Math.round(x));
    return Math.round(x);
  };

  const pixelsToMS = (px: number): number => canvasWidth / (windowRange.endMS - windowRange.startMS) * px;

  if (waveform === "loading") {
    return <div>loading...</div>;
  }

  return (
    <div className={classes.waveFormContainer}>
      <canvas ref={canvasRef} height={TOP_HEIGHT} width={canvasWidth}/>
      <div className={classes.playHeadTop} style={{left: msToPx(playerPositionMS)}}/>

      <Segment
        segment={range}
        updateSegment={() => {
        }}
        pixelsToMS={pixelsToMS}
        msToPixels={msToPx}/>
    </div>
  );
}

