import {Button, Grid} from "@material-ui/core";
import React from "react";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from '@material-ui/icons/SkipNext';

type Props = { currentIndex: number, setByIndex: (newIndex: number) => void, maxIndex: number };

export const Pager = ({currentIndex, setByIndex, maxIndex}: Props) => {
  return (
    <Grid container item xs={12} justify="space-between">
      <Grid item xs={1}>
        <Button disabled={currentIndex === 0}
                onClick={() => setByIndex(currentIndex - 1)}
                startIcon={<SkipPreviousIcon/>}>
          Previous
        </Button>
      </Grid>


      <Grid item xs={1}>
        <Button disabled={currentIndex === maxIndex}
                onClick={() => setByIndex(currentIndex + 1)}
                endIcon={<SkipNextIcon/>}>
          Next
        </Button>
      </Grid>
    </Grid>
  );
};