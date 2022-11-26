import React, {useCallback, useEffect, useRef, useState} from "react";
import {useTheme} from "@mui/material";
import {makeStyles} from 'tss-react/mui';

const TOP_HEIGHT = 50;
const CONTAINER_HEIGHT = TOP_HEIGHT;


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
}));


type WaveformProps = {
  samples: number[],
  sampleRate: number,
  playerPositionMS: number,
  initWidth: number,
}


export function MiniWaveform({
                               samples,
                               sampleRate,
                               initWidth,
                               playerPositionMS,
                             }: WaveformProps) {
  const canvas1Ref = useRef<HTMLCanvasElement>(null)
  const [canvasWidth, setCanvasWidth] = useState(initWidth)
  const totalMS = (samples.length / sampleRate) * 1000
  const theme = useTheme();

  const {classes} = useStyles();


  useEffect(() => {
    setCanvasWidth(canvas1Ref.current?.parentElement?.clientWidth || initWidth)
  }, [])

  const drawBackground = useCallback((context: CanvasRenderingContext2D, width: number, height: number) => {
    context.fillStyle = theme.palette.primary.main
    context.fillRect(0, 0, width, height)
  }, [theme]);


  const drawWaveForm = useCallback((context: CanvasRenderingContext2D, samples: number[], waveformHeight: number, sampleWidth: number) => {
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
    const canvas = canvas1Ref.current
    const context = canvas?.getContext('2d')
    if (!context) {
      return
    }
    const {width} = context.canvas;
    const sampleWidth = width / samples.length
    drawBackground(context, width, TOP_HEIGHT);
    drawWaveForm(context, samples, TOP_HEIGHT, sampleWidth);
  }, [canvasWidth, drawBackground, drawWaveForm, samples])


  return (
    <div className={classes.waveFormContainer}>
      <canvas ref={canvas1Ref} height={TOP_HEIGHT} width={canvasWidth}/>
      <div className={classes.playHeadTop} style={{left: `${(playerPositionMS / totalMS) * 100}%`}}/>
    </div>
  );

}

