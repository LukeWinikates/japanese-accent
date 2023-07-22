import React, {useEffect, useRef, useState} from "react";
import {useTheme} from "@mui/material";
import {makeStyles} from 'tss-react/mui';
import {DrawBackground, DrawWaveform} from '../../Waveform/canvas';

const TOP_HEIGHT = 50;
const CONTAINER_HEIGHT = TOP_HEIGHT;


const useStyles = makeStyles<{}>()((theme) => ({
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

// TODO: might need to rework the canvas width setting here
export function MiniWaveform({
                               samples,
                               sampleRate,
                               initWidth,
                               playerPositionMS,
                             }: WaveformProps) {
  const canvas1Ref = useRef<HTMLCanvasElement>(null!)
  const [canvasWidth, setCanvasWidth] = useState(initWidth)
  const totalMS = (samples.length / sampleRate) * 1000
  const theme = useTheme();

  const {classes} = useStyles({});

  const backgroundColor = theme.palette.primary.main;
  const waveformColor = theme.palette.background.default;

  useEffect(() => {
    setCanvasWidth(canvas1Ref.current?.parentElement?.clientWidth || initWidth)
  }, [initWidth])


  useEffect(() => {
    const canvas = canvas1Ref.current
    const context = canvas?.getContext('2d')
    if (!context) {
      return
    }
    const {width} = context.canvas;
    const sampleWidth = width / samples.length
    DrawBackground(context, width, TOP_HEIGHT, backgroundColor);
    DrawWaveform(context, samples, TOP_HEIGHT, sampleWidth, waveformColor);
  }, [canvasWidth, samples, backgroundColor, waveformColor])


  return (
    <div className={classes.waveFormContainer}>
      <canvas ref={canvas1Ref} height={TOP_HEIGHT} width={canvasWidth}/>
      <div className={classes.playHeadTop} style={{left: `${(playerPositionMS / totalMS) * 100}%`}}/>
    </div>
  );

}

