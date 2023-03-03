import React, {useEffect, useRef, useState} from "react";
import {useTheme} from "@mui/material";
import {makeStyles} from 'tss-react/mui';
import {DrawBackground, DrawWaveform, DrawWaveformUints} from '../../Waveform/canvas';
import axios from "axios";

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
  url: string,
  playerPositionMS: number,
  initWidth: number,
}
const getSamples = (url: string) =>  {
  return axios.get<ArrayBuffer>(url, {responseType: 'arraybuffer'})
}

// TODO: might need to rework the canvas width setting here
export function MiniWaveform({
                               url,
                               initWidth,
                               playerPositionMS,
                             }: WaveformProps) {
  const canvas1Ref = useRef<HTMLCanvasElement>(null)
  const sampleRate = 8000;
  const [samples, setSamples] = useState<Uint16Array|null>(null);


  const [canvasWidth, setCanvasWidth] = useState(initWidth)
  const theme = useTheme();

  const {classes} = useStyles();

  const backgroundColor = theme.palette.primary.main;
  const waveformColor = theme.palette.background.default;

  useEffect(() => {
    getSamples(url).then(r => setSamples(new Uint16Array(r.data)))
  })

  useEffect(() => {
    setCanvasWidth(canvas1Ref.current?.parentElement?.clientWidth || initWidth)
  }, [initWidth])


  useEffect(() => {
    if (!samples) {
      return;
    }
    const canvas = canvas1Ref.current
    const context = canvas?.getContext('2d')
    if (!context) {
      return
    }
    const {width} = context.canvas;
    const sampleWidth = width / samples.length
    DrawBackground(context, width, TOP_HEIGHT, backgroundColor);
    DrawWaveformUints(context, samples, TOP_HEIGHT, sampleWidth, waveformColor);
  }, [canvasWidth, samples, backgroundColor, waveformColor])

  const totalMS = samples ? (samples.length / sampleRate) * 1000 : 0

  return (
    <div className={classes.waveFormContainer}>
      <canvas ref={canvas1Ref} height={TOP_HEIGHT} width={canvasWidth}/>
      <div className={classes.playHeadTop} style={{left: `${(playerPositionMS / totalMS) * 100}%`}}/>
    </div>
  );

}

