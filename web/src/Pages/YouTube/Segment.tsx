import React, {ForwardedRef, useState} from "react";
import {makeStyles} from 'tss-react/mui';
import {DraftSegment,} from "../../App/api";
import {Resizable, ResizeCallbackData, ResizeHandle} from 'react-resizable';

const useStyles = makeStyles()((theme) => ({
  span: {
    position: "absolute",
    display: "inline-flex",
    // top: 0,
    height: 100,
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
  segment: DraftSegment,
  updateSegment: (s: DraftSegment) => void,
  msToPixels: (px: number) => number,
};

export function Segment({
                          segment,
                          updateSegment,
                          msToPixels,
                        }: Props) {
  const {classes} = useStyles();
  const [width, setWidth] = useState(msToPixels(segment.endMS - segment.startMS));
  const [left, setLeft] = useState(msToPixels(segment.startMS));

  const onResize = (event: any, {size, handle}: ResizeCallbackData) => {
    setWidth(size.width);
    if (handle === "w") {
      setLeft(left - (size.width - width))
    }
  };

  const commitChange = () => {
    updateSegment({
      ...segment,
      startMS: msToPixels(left),
      endMS: msToPixels(left + width),
    })
  }

  function handle(axis: ResizeHandle, ref: ForwardedRef<any>) {
    return (
      <div ref={ref} className={`${classes.segmentResizer} ${axis === "w" ? classes.resizerWest : classes.resizerEast}`}/>
    );
  }

  return (
    <Resizable
      key={segment.startMS}
      width={width}
      height={100}
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