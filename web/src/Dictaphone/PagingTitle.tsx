import {Button, Grid, Typography} from "@mui/material";
import React, {useCallback} from "react";
import {Clip} from "../api/types";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from '@mui/icons-material/SkipNext';

type Props = { clip: Clip, clips: Clip[], currentClipIndex: number, setClipByIndex: (idx: number) => void };
export const PagingTitle = ({clip, clips, currentClipIndex, setClipByIndex}: Props) => {
  const maximumClipIndex = clips.length - 1;

  const advanceOne = useCallback(() => setClipByIndex(currentClipIndex + 1), [setClipByIndex, currentClipIndex]);
  const backOne = useCallback(() => setClipByIndex(currentClipIndex - 1), [setClipByIndex, currentClipIndex]);
  return <>
    <Typography>
      #{currentClipIndex + 1} / {clips.length}
    </Typography>
    <Grid container item xs={12} spacing={1} justifyContent="space-between">
      <Grid item xs={1}>
        <Button disabled={currentClipIndex === 0}
                onClick={backOne}
                startIcon={<SkipPreviousIcon/>}>
          Previous
        </Button>
      </Grid>
      <Grid container item xs={10} spacing={2}>
        <strong style={{display: "inline-block", margin: "auto"}}>
          「{clip?.text}」
        </strong>
      </Grid>
      <Grid item xs={1}>
        <Button disabled={currentClipIndex === maximumClipIndex}
                onClick={advanceOne}
                endIcon={<SkipNextIcon/>}>
          Next
        </Button>
      </Grid>
    </Grid>
  </>;
}