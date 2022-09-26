import {duration, Segment} from "../../App/api";
import {IconButton} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React from "react";
import {msToHumanReadable} from "../../App/time";
import {WithIndex} from "../../App/WithIndex";

type Props = { segmentWithIndex: WithIndex<Segment>, onSegmentSelected: (segment: WithIndex<Segment>) => void };

const useStyles = makeStyles((theme) => ({
  segmentContainer: {
    backgroundColor: theme.palette.primary.dark,
    margin: 2,
  },
}));


export function PlayableSegment({segmentWithIndex, onSegmentSelected}: Props) {
  const {value: segment} = segmentWithIndex;
  const classes = useStyles();

  function computedWidth() {
    return Math.min(
      Math.max(duration(segment) * 10, 10),
      150);
  }

  return (
    <div key={segment.uuid}
         onClick={() => onSegmentSelected(segmentWithIndex)}
         style={{width: computedWidth(), height: 25}}
         className={classes.segmentContainer}
         title={`${segment.text} : ${msToHumanReadable(duration(segment))}`}
    >
      <IconButton onClick={() => onSegmentSelected(segmentWithIndex)} size="large">
      </IconButton>
    </div>
  );
}