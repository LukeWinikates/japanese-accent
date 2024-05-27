import React, {ForwardedRef, useCallback, useEffect, useState} from "react";
import {makeStyles} from 'tss-react/mui';
import {Resizable, ResizeCallbackData, ResizeHandle} from 'react-resizable';

const useStyles = makeStyles<{}>()((theme) => ({
  span: {
    position: "absolute",
    display: "inline-flex",
    height: "100%",
    backgroundColor: theme.palette.primary.light,
    opacity: .4,
  },
  clipResizer: {
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
  clip: { startMS: number, endMS: number },
  updateClip: (s: { startMS: number, endMS: number }) => void,
  msToPixels: (ms: number) => number,
  pixelsToMS: (px: number) => number,
};

export function ClipResizer({
                              clip,
                              updateClip,
                              msToPixels,
                              pixelsToMS,
                            }: Props) {
  const {classes} = useStyles({});
  const startPx = msToPixels(clip.startMS);
  const endPX = msToPixels(clip.endMS);
  const width = endPX - startPx;

  const [localState, setLocalState] = useState({left: 0, width: 0})

  useEffect(() => {
    setLocalState({
      left: startPx,
      width: width
    })
  }, [clip, startPx, width])

  const onResize = useCallback((event: any, {size, handle}: ResizeCallbackData) => {
    if (handle === "w") {
      setLocalState({
        width: size.width,
        left: endPX - size.width,
      })
    } else {
      setLocalState({
        ...localState,
        width: size.width,
      })
    }
  }, [setLocalState, localState, endPX]);

  const commitChange = useCallback(() => {
    updateClip({
        ...clip,
        startMS: pixelsToMS(localState.left),
        endMS: pixelsToMS(localState.left + localState.width),
      }
    )
  }, [updateClip, clip, localState.left, localState.width, pixelsToMS]);

  const handle = useCallback((axis: ResizeHandle, ref: ForwardedRef<any>) => {
    return (
      <div ref={ref}
           className={`${classes.clipResizer} ${axis === "w" ? classes.resizerWest : classes.resizerEast}`}/>
    );
  }, [classes]);

  return (
    <Resizable
      width={localState.width}
      height={50}
      onResize={onResize}
      onResizeStop={commitChange}
      axis="x"
      resizeHandles={["w", "e"]}
      handle={handle}
    >
      <div className={`${classes.span}`}
           style={{width: localState.width, left: localState.left}}>
      </div>
    </Resizable>
  );
}