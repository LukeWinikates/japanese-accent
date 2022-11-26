import React, {useCallback, useEffect, useRef, useState} from "react";
import {useTheme} from "@mui/material";
import {makeStyles} from 'tss-react/mui';
import {Waveform} from "../App/api";
import {Range} from '../App/time'
import {Loadable} from "../App/loadable";
import {Segment} from "../Pages/YouTube/Segment";

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

  const drawBackground = useCallback((context: CanvasRenderingContext2D, width: number, height: number) => {
    context.fillStyle = theme.palette.grey.A200
    context.fillRect(0, 0, width, height)
  }, [theme]);


  // TODO: address this duplication
  const drawWaveForm = useCallback((context: CanvasRenderingContext2D, samples: number[], waveformHeight: number, sampleWidth: number) => {
    if (samples.length === 0) {
      return
    }
    context.fillStyle = theme.palette.background.default

    const maxDomain = samples.map(Math.abs).reduce((v, curr) => {
      return curr > v ? curr : v;
    })

    samples.forEach((s, i) => {
      const rectHeight = (s / maxDomain) * (waveformHeight)
      const y = (waveformHeight / 2) - (rectHeight / 2);
      context.fillRect(i * sampleWidth, y, 1, rectHeight)
    })
  }, [theme]);

  useEffect(() => {
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
    drawBackground(context, width, TOP_HEIGHT);
    drawWaveForm(context, samples, TOP_HEIGHT, sampleWidth);
  }, [canvasWidth, drawBackground, drawWaveForm, waveform, range])


  function inRange(waveform: Waveform): number[] {
    const firstIndex = Math.round((windowRange.startMS / 1000) * waveform.sampleRate);
    const lastIndex = Math.round((windowRange.endMS / 1000) * waveform.sampleRate);
    return waveform.samples.slice(firstIndex, lastIndex)
  }

  const  msToPctOfRange = (ms: number) => {
    // console.log("ms", ms);
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

