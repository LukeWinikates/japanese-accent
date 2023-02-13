import React, {ForwardedRef, useState} from "react";
import {makeStyles} from 'tss-react/mui';
import {Resizable, ResizeCallbackData, ResizeHandle} from 'react-resizable';

const useStyles = makeStyles()((theme) => ({
  span: {
    position: "absolute",
    display: "inline-flex",
    height: "100%",
    backgroundColor: theme.palette.primary.light,
    opacity: .4,
  },
  segmentResizer: {
    display: "inline-block",
    cursor: "col-resize",
    backgroundColor: theme.palette.secondary.light,
    width: 10,
    height: "100%",
    position: "absolute"
  },
  resizerWest: {
    left: 0,
  },
  resizerEast: {
    right: 0
  }
}));

type Props = {
  segment: { startMS: number, endMS: number },
  updateSegment: (s: {startMS: number, endMS: number }) => void,
  msToPixels: (ms: number) => number,
  pixelsToMS: (px: number) => number,
};

export function Segment({
                          segment,
                          updateSegment,
                          msToPixels,
                          pixelsToMS,
                        }: Props) {
  const {classes} = useStyles();
  let startPx = msToPixels(segment.startMS);
  let endPX = msToPixels(segment.endMS);
  const [width, setWidth] = useState(endPX  - startPx);
  const [left, setLeft] = useState(startPx);

  const onResize = (event: any, {size, handle}: ResizeCallbackData) => {
    setWidth(size.width);
    if (handle === "w") {
      setLeft(left - (size.width - width))
    }
  };

  const commitChange = () => {
    updateSegment({
      ...segment,
      startMS: pixelsToMS(left),
      endMS: pixelsToMS(left + width),
    })
  }

  function handle(axis: ResizeHandle, ref: ForwardedRef<any>) {
    return (
      <div ref={ref}
           className={`${classes.segmentResizer} ${axis === "w" ? classes.resizerWest : classes.resizerEast}`}/>
    );
  }

  return (
    <Resizable
      width={width}
      height={50}
      onResize={onResize}
      onResizeStop={commitChange}
      axis="x"
      resizeHandles={["w", "e"]}
      handle={handle}
    >
      <div className={`${classes.span}`}
           style={{width, left}}>
      </div>
    </Resizable>
  );
}