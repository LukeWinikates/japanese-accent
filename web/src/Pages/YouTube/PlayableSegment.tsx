import {Clip, durationSeconds} from "../../api/types";
import {IconButton} from "@mui/material";
import {makeStyles} from 'tss-react/mui';
import React from "react";
import {msToHumanReadable} from "../../App/time";
import {WithIndex} from "../../App/WithIndex";

type Props = { segmentWithIndex: WithIndex<Clip>, onSegmentSelected: (segment: WithIndex<Clip>) => void };

const useStyles = makeStyles()((theme) => ({
  segmentContainer: {
    backgroundColor: theme.palette.primary.dark,
    margin: 2,
  },
}));


export function PlayableSegment({segmentWithIndex, onSegmentSelected}: Props) {
  const {value: segment} = segmentWithIndex;
  const {classes} = useStyles();

  function computedWidth() {
    return Math.min(
      Math.max(durationSeconds(segment) * 10, 10),
      150);
  }

  return (
    <div key={segment.uuid}
         onClick={() => onSegmentSelected(segmentWithIndex)}
         style={{width: computedWidth(), height: 25}}
         className={classes.segmentContainer}
         title={`${segment.text} : ${msToHumanReadable(durationSeconds(segment))}`}
    >
      <IconButton onClick={() => onSegmentSelected(segmentWithIndex)} size="large">
      </IconButton>
    </div>
  );
}