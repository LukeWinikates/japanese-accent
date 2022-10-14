import React, {useCallback, useEffect, useRef, useState} from "react";
import {useTheme} from "@mui/material";
import {makeStyles} from 'tss-react/mui';
import {DraftSegment, Timing} from "../../App/api";
import {Segment} from "./Segment";
import {SegmentSelector} from "./SegmentSelector";

type Range = { startMS: number, endMS: number };

const useStyles = makeStyles()((theme) => ({
  playHeadTop: {
    position: "absolute",
    top: 0,
    height: 100,
    width: 2,
    backgroundColor: theme.palette.secondary.main
  },
  playHeadBottom: {
    position: "absolute",
    top: 140,
    height: 100,
    width: 2,
    backgroundColor: theme.palette.secondary.main
  },
  scrubber: {
    position: "absolute",
    top: 0,
    height: 110,
    borderWidth: 1,
    borderColor: theme.palette.secondary.main,
    borderStyle: "solid"
  },
  scrubberHandle: {
    height: 25,
    width: "100%",
    top: 110,
    position: "relative",
    textAlign: "center",
    backgroundColor: theme.palette.secondary.main,
    userSelect: "none",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.secondary.light
    }
  },
  waveFormContainer: {
    position: "relative",
    height: 260,
    overflow: "hidden"
  },
  timing: {
    position: "absolute",
    top: 0,
    height: 10,
    width: 1,
    backgroundColor: theme.palette.secondary.main,
  },
  zoomedContainer: {
    display: "block", marginTop: 36, position: "relative"
  },
  zoomedTiming: {
    position: "absolute",
    display: "inline-block",
    // top: -104,
    height: 100,
    width: 2,
    backgroundColor: theme.palette.text.primary,
  },
  span: {
    position: "absolute",
    display: "inline-flex",
    // top: 0,
    height: 100,

    "&:hover": {
      // backgroundColor: theme.palette.secondary.light,
      // opacity: 0.25,
    }
  },
  selected: {
    backgroundColor: theme.palette.secondary.dark,
    opacity: 0.25,
  },
  timingContainer: {
    position: "relative"
  },
  segmentSelector: {
    display: "inline-block",
    flexGrow: 1,
    cursor: "pointer",
  }
}));

type ScrubberWindowRange = {
  startMS: number,
  endMS: number,
};

type DragFacts = {
  x: number,
}

type WaveformProps = {
  samples: number[],
  sampleRate: number,
  scrubberWindowRange: ScrubberWindowRange,
  setScrubberWindowRange: (range: ScrubberWindowRange) => void,
  playerPositionMS: number,
  timings: Timing[],
  // addSegment: (range: Range) => void,
  candidateSegments: DraftSegment[]
  setSelectedSegment: (cs: DraftSegment) => void,
  // setSegments: (segs: DraftSegment[]) => void,
  selectedSegment: DraftSegment | null,
}

const WAVEFORM_HEIGHT = 100;
const STEP_INCREMENT_MS = 30 * 1000;

function zoom(samples: number[], sampleRate: number, scrubberWindowRange: ScrubberWindowRange): number[] {
  return samples.filter((val, i) => {
    let time = i / sampleRate * 1000;
    return scrubberWindowRange.startMS <= time &&
      time <= scrubberWindowRange.endMS;
  })
}


export function Waveform({
                           samples,
                           sampleRate,
                           scrubberWindowRange,
                           setScrubberWindowRange,
                           playerPositionMS,
                           candidateSegments,
                           timings,
                           selectedSegment,
                           // setSegments,
                           setSelectedSegment
                         }: WaveformProps) {
  const canvas1Ref = useRef<HTMLCanvasElement>(null)
  const zoomedContainerRef = useRef<HTMLDivElement>(null)
  const scrubberRef = useRef<HTMLDivElement>(null)
  const [canvasWidth, setCanvasWidth] = useState(1200)
  const [dragFacts, setDragFacts] = useState<DragFacts | false>(false)
  const [offset, setOffset] = useState<number>(0);
  const totalMS = (samples.length / sampleRate) * 1000
  const theme = useTheme();

  const {classes} = useStyles();
  const numWaveformChunks = Math.ceil(totalMS / 30_000);

  const clamp = useCallback((range: Range) => {
    if (range.startMS < 0) {
      return {
        startMS: 0,
        endMS: STEP_INCREMENT_MS
      }
    }
    if (range.endMS > totalMS) {
      return {
        startMS: totalMS - STEP_INCREMENT_MS,
        endMS: totalMS
      }
    }
    return range;
  }, [totalMS]);

  useEffect(() => {
    setCanvasWidth(canvas1Ref.current?.parentElement?.clientWidth || 1200)
  }, [])

  function updateSegmentAtIndex(i: number, s: DraftSegment) {
    console.log("changing segment: ", i)
    // throw "think about this..."
    // rather than updating at index, maybe we make a PUT call that creates or modifies the candidate that originated from this advice candidate segment
    // the candidate can be immutable, but the actual segment merely links back to it for reference
    // so how would we model that in the in-memory data model? Tick the universe version forward by one?
    // update the parent's in-memory representation (update the array after successful PUT?)
    // let newSegments = [...candidateSegments];
    // newSegments.splice(i, 1, s)
    // setSegments(newSegments)
  }

  const drawBackground = useCallback((context: CanvasRenderingContext2D, width: number) => {
    context.fillStyle = theme.palette.primary.main
    context.fillRect(0, 0, width, WAVEFORM_HEIGHT)
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
    drawBackground(context, width);
    drawWaveForm(context, samples, WAVEFORM_HEIGHT, sampleWidth);
  }, [canvasWidth, drawBackground, drawWaveForm, samples])

  useEffect(() => {
    const container = zoomedContainerRef.current
    if (!container) {
      return;
    }
    const canvases = container.querySelectorAll("canvas");
    canvases.forEach((canvas, i) => {
      const context = canvas?.getContext('2d')
      if (!context) {
        return
      }
      const {width} = context.canvas;
      drawBackground(context, width)
      const zoomed = zoom(samples, sampleRate, clamp({
        startMS: (i * STEP_INCREMENT_MS),
        endMS: ((i + 1) * STEP_INCREMENT_MS),
      }));
      const sampleWidth = width / zoomed.length
      drawWaveForm(context, zoomed, WAVEFORM_HEIGHT, sampleWidth);
    })

  }, [canvasWidth, clamp, drawBackground, drawWaveForm, sampleRate, samples])

  function msToZoomedPixels(targetMS: number) {
    const containerWidthPixels = numWaveformChunks * canvasWidth;
    const containerWidthMS = numWaveformChunks * STEP_INCREMENT_MS;
    const ratio = targetMS / containerWidthMS;
    return ratio * containerWidthPixels;
  }

  function zoomOffset() {
    return -msToZoomedPixels(scrubberWindowRange.startMS);
  }

  const startDragging = (e: any) => {
    setDragFacts({x: e.clientX})
  }

  function pixelsToMS(px: number) {
    const pctMoved = px / (canvasWidth - (scrubberRef.current?.clientWidth || 0));
    return pctMoved * totalMS;
  }

  const stopDragging = (e: any) => {
    if (!dragFacts) {
      return;
    }
    const offSetMS = pixelsToMS(e.clientX - dragFacts.x);
    const newStart = scrubberWindowRange.startMS + offSetMS;
    setScrubberWindowRange(clamp({
      endMS: newStart + STEP_INCREMENT_MS,
      startMS: newStart
    }));
    setDragFacts(false);
    setOffset(0);
  }

  const trackDragging = (e: any) => {
    if (!dragFacts) {
      return;
    }
    setOffset(e.clientX - dragFacts.x)
  }


  function chunks(): number[] {
    let c = [];
    for (let i = 0; i < numWaveformChunks; i++) {
      c.push(i);
    }
    return c;
  }

  return (
    <>
      <button onClick={() => setScrubberWindowRange(clamp({
        startMS: scrubberWindowRange.startMS - STEP_INCREMENT_MS,
        endMS: scrubberWindowRange.endMS - STEP_INCREMENT_MS,
      }))}>left
      </button>
      <button onClick={() => setScrubberWindowRange(clamp({
        startMS: scrubberWindowRange.startMS + STEP_INCREMENT_MS,
        endMS: scrubberWindowRange.endMS + STEP_INCREMENT_MS,
      }))}>right
      </button>
      <div className={classes.waveFormContainer} onMouseUp={stopDragging}>
        <canvas ref={canvas1Ref} height={WAVEFORM_HEIGHT} width={canvasWidth}/>
        <div className={classes.timingContainer}>
          {timings.map(t => {
            return (
              <div key={t.timeMS} className={classes.timing} style={{left: `${t.timeMS * 100 / totalMS}%`}}/>
            );
          })}
        </div>
        <div className={classes.playHeadTop} style={{left: `${(playerPositionMS / totalMS) * 100}%`}}/>
        <div className={classes.scrubber} ref={scrubberRef} style={{
          left: `calc(${(scrubberWindowRange.startMS / totalMS) * 100}% + ${offset}px)`,
          width: `${((scrubberWindowRange.endMS - scrubberWindowRange.startMS) / totalMS) * 100}%`
        }}>
          <div className={classes.scrubberHandle} onMouseDown={startDragging} onMouseMove={trackDragging}>...</div>
        </div>

        <div ref={zoomedContainerRef} className={classes.zoomedContainer} style={{
          marginLeft: zoomOffset(), width: numWaveformChunks * canvasWidth
        }}>
          {
            chunks().map((k) => {
              return <canvas key={k} height={WAVEFORM_HEIGHT} width={canvasWidth}/>
            })
          }
          {candidateSegments.map((s, i) => {
            if (selectedSegment && selectedSegment.uuid === s.uuid) {
              return <Segment
                key={i}
                segment={selectedSegment}
                updateSegment={(s) => {
                  updateSegmentAtIndex(i, s)
                }}
                msToPixels={msToZoomedPixels}/>
            }
            return (
              <SegmentSelector
                key={i}
                segment={s}
                selected={false}
                onSelected={() => setSelectedSegment(s)}
                msToPixels={msToZoomedPixels}
              />
            );
          })}

          <div className={classes.playHeadBottom} style={{
            left: msToZoomedPixels(playerPositionMS)
          }
          }/>
        </div>
      </div>
    </>
  );

}

