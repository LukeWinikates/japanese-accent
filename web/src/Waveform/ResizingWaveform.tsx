import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useTheme} from "@mui/material";
import {makeStyles} from 'tss-react/mui';
import {BasicClip, Waveform} from "../api/types";
import {Range} from '../App/time'
import {DrawBackground, DrawWaveform} from "./canvas";
import {msToPctOfRange} from "./position";
import {Loader, Settable} from "../App/Loader";
import {useBackendAPI} from "../App/useBackendAPI";
import {ClipResizer} from "../Pages/YouTube/ClipResizer";

const TOP_HEIGHT = 50;
const SCRUBBER_HEIGHT = 5;
const SCRUBBER_HANDLE_HEIGHT = 25;
const CONTAINER_HEIGHT = TOP_HEIGHT + SCRUBBER_HEIGHT + SCRUBBER_HANDLE_HEIGHT;

const useStyles = makeStyles<void>()((theme) => ({
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

type ClipResizingWaveformProps<T extends BasicClip> = {
  clip: T
  setClip: (s: T) => void
  onStartResizing: () => void,
  playerPositionMS: number,
}

type ResizingWaveformProps = {
  range: Range
  setRange: (r: Range) => void
  onStartResizing: () => void,
  playerPositionMS: number,
  waveform: Waveform
}

export function ClipResizingWaveform<T extends BasicClip>({
                                                                clip,
                                                                setClip,
                                                                playerPositionMS,
                                                                onStartResizing
                                                              }: ClipResizingWaveformProps<T>) {
  const api = useBackendAPI();
  const callback = useCallback(() =>
      api.waveform.GET(clip.videoUuid, 8000),
    [api.waveform, clip.videoUuid]
  );
  const setRange = useCallback((r: Range) => {
    setClip({
      ...clip,
      startMS: r.startMS,
      endMS: r.endMS
    })
  }, [setClip, clip]);

  const Into = useCallback(({value}: Settable<Waveform>) => {
      return (
        <ResizingWaveform range={clip} waveform={value} setRange={setRange} onStartResizing={onStartResizing}
                          playerPositionMS={playerPositionMS}/>
      );
    }
    ,
    [clip, onStartResizing, playerPositionMS, setRange]
  )

  return (
    <Loader callback={callback} into={Into}/>
  )
}

export function ResizingWaveform({
                                   waveform,
                                   range,
                                   setRange,
                                   playerPositionMS
                                 }: ResizingWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const [canvasWidth, setCanvasWidth] = useState<number | null>(null)
  const theme = useTheme();
  const [totalMS, setTotalMS] = useState<number>(0)

  const {classes} = useStyles();

  const RESIZER_PADDING_MS = 2000;

  function clamp(val: number): number {
    return Math.min(Math.max(0, val), totalMS);
  }

  const windowRange = {
    startMS: clamp(range.startMS - RESIZER_PADDING_MS),
    endMS: clamp(range.endMS + RESIZER_PADDING_MS),
  }

  useEffect(() => {
    setCanvasWidth(canvasRef.current?.parentElement?.clientWidth || null)
    setTotalMS(waveform.samples.length / waveform.sampleRate * 1000);
  }, [waveform])


  const backgroundColor = theme.palette.grey.A200;
  const waveformColor = theme.palette.background.default;

  useEffect(() => {
    function inRange(waveform: Waveform): number[] {
      const firstIndex = Math.round((windowRange.startMS / 1000) * waveform.sampleRate);
      const lastIndex = Math.round((windowRange.endMS / 1000) * waveform.sampleRate);
      return waveform.samples.slice(firstIndex, lastIndex)
    }

    if (!canvasWidth) {
      return;
    }
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) {
      return
    }
    const {width} = context.canvas;
    const samples = inRange(waveform);
    const sampleWidth = width / samples.length
    DrawBackground(context, width, TOP_HEIGHT, backgroundColor);
    DrawWaveform(context, samples, TOP_HEIGHT, sampleWidth, waveformColor);
  }, [canvasWidth, waveform, range, backgroundColor, waveformColor, windowRange.startMS, windowRange.endMS])

  const msToPx = useMemo(() => {
    return (ms: number): number => {
      if (!canvasWidth) {
        return 0
      }
      const wr = {
        startMS: windowRange.startMS,
        endMS: windowRange.endMS
      }
      const x = (msToPctOfRange(wr, ms) / 100) * canvasWidth;
      return Math.round(x);
    }
  }, [canvasWidth, windowRange.startMS, windowRange.endMS]);

  const pxToMS = useMemo(() => {
    return (px: number): number => {
      if (!canvasWidth) {
        return 0
      }

      return Math.round(((px / canvasWidth) * (windowRange.endMS - windowRange.startMS)) + windowRange.startMS);
    }
  }, [canvasWidth, windowRange.startMS, windowRange.endMS]);

  return (
    <div className={classes.waveFormContainer}>
      <canvas ref={canvasRef!} height={TOP_HEIGHT} width={canvasWidth || 0}/>
      <div className={classes.playHeadTop} style={{left: msToPx(playerPositionMS)}}/>

      <ClipResizer
        clip={range}
        updateClip={setRange}
        pixelsToMS={pxToMS}
        msToPixels={msToPx}/>
    </div>
  );
}

