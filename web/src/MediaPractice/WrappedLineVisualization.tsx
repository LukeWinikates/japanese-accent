import React from 'react';

import {duration, Segment} from "../api";
import {makeStyles} from "@material-ui/core";


const useStyles = makeStyles(theme => (
  {
    container: {
      display: 'flex',
    },
    item: {
      color: theme.palette.grey[500],
    }
  }
));

declare type RenderingBlock = {
  segmentIndex: number,
  rowNumber: number,
  segment: Segment,
  // pixelWidth: number,
  duration: number,
}

function renderingBlocks(segments: Segment[]): RenderingBlock[] {
  const queue = [...segments];
  const durationBreakpointSeconds = 40;
  let currentSegment, segmentIndex = 0, rowNumber=0, remainingRowDuration = durationBreakpointSeconds, blocks = [];
  while ((currentSegment = queue.pop())) {
    let remainingSegmentDuration = duration(currentSegment);
    while (remainingSegmentDuration > 0) {
      console.log("remaining segment duration: ", remainingSegmentDuration);
      console.log("remaining row duration: ", remainingRowDuration);
      if (remainingRowDuration < remainingSegmentDuration) {
        console.log("partial segment");
        blocks.push({
          segmentIndex,
          rowNumber,
          segment: currentSegment,
          duration: remainingRowDuration,
        });
        remainingSegmentDuration = remainingSegmentDuration - remainingRowDuration;
        remainingRowDuration = 0;
      } else {
        console.log("full segment")
        blocks.push({
          segmentIndex,
          rowNumber,
          segment: currentSegment,
          duration: remainingSegmentDuration,
        });
        remainingRowDuration = remainingRowDuration - remainingSegmentDuration;
        remainingSegmentDuration = 0;
        segmentIndex++;
      }
      if (remainingRowDuration === 0) {
        remainingRowDuration = durationBreakpointSeconds;
        rowNumber++;
      }
    }
  }
  return blocks;
}

export const WrappedLineVisualization = ({segments}: { segments: Segment[] }) => {
  const classes = useStyles();
  // const width = 800;
  // const unit = 10;

  // const  totalLength = segments[segments.length-1].end / 1000;

  return (
    <div className={classes.container} >
      {
        renderingBlocks(segments).map((block, index) => {
          return (
            <div className={classes.item} key={index}>
              {block.segment.text}
            </div>
          );
        })
      }
    </div>
  );
};