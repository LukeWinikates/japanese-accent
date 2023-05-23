import {Button, Grid, Typography} from "@mui/material";
import React from "react";
import {Segment} from "../api/types";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from '@mui/icons-material/SkipNext';

type Props = { segment: Segment, segments: Segment[], currentSegmentIndex: number, setSegmentByIndex: (idx: number) => void };
export const PagingTitle = ({segment, segments, currentSegmentIndex, setSegmentByIndex}: Props) => {
  const lastSegmentIndex = segments.length - 1;

  return <>
    <Typography>
      #{currentSegmentIndex + 1} / {segments.length}
    </Typography>
    <Grid container item xs={12} spacing={1} justifyContent="space-between">
      <Grid item xs={1}>
        <Button disabled={currentSegmentIndex === 0}
                onClick={() => setSegmentByIndex(currentSegmentIndex - 1)}
                startIcon={<SkipPreviousIcon/>}>
          Previous
        </Button>
      </Grid>
      <Grid container item xs={10} spacing={2}>
        <strong style={{display: "inline-block", margin: "auto"}}>
          「{segment?.text}」
        </strong>
      </Grid>
      <Grid item xs={1}>
        <Button disabled={currentSegmentIndex === lastSegmentIndex}
                onClick={() => setSegmentByIndex(currentSegmentIndex + 1)}
                endIcon={<SkipNextIcon/>}>
          Next
        </Button>
      </Grid>
    </Grid>
  </>;
}