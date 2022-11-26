import {Button, Grid} from "@mui/material";
import React from "react";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from '@mui/icons-material/SkipNext';

type Props = {
  currentIndex: number,
  setByIndex: (newIndex: number) => void,
  maxIndex: number
  betweenElement?: React.ReactElement
};

export const Pager = ({currentIndex, setByIndex, maxIndex, betweenElement}: Props) => {
  return (
    <Grid container item xs={12} justifyContent="space-between">
      <Grid item xs={1}>
        <Button disabled={currentIndex === 0}
                onClick={() => setByIndex(currentIndex - 1)}
                startIcon={<SkipPreviousIcon/>}>
          Previous
        </Button>
      </Grid>

      {!!betweenElement && betweenElement}

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