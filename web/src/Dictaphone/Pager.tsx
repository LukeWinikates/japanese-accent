import {Button, Grid} from "@mui/material";
import React, {useCallback} from "react";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from '@mui/icons-material/SkipNext';

type Props = {
  currentIndex: number,
  setByIndex: (newIndex: number) => void,
  maxIndex: number
  betweenElement?: React.ReactElement
};

export const Pager = ({currentIndex, setByIndex, maxIndex, betweenElement}: Props) => {
  const backOnePage = useCallback(() => setByIndex(currentIndex - 1), [currentIndex, setByIndex]);
  const aheadOnePage = useCallback(() => setByIndex(currentIndex + 1), [currentIndex, setByIndex]);

  return (
    <Grid container item xs={12} justifyContent="space-between">
      <Grid item xs={1}>
        <Button disabled={currentIndex === 0}
                onClick={backOnePage}
                startIcon={<SkipPreviousIcon/>}>
          Previous
        </Button>
      </Grid>

      {!!betweenElement && betweenElement}

      <Grid item xs={1}>
        <Button disabled={currentIndex === maxIndex}
                onClick={aheadOnePage}
                endIcon={<SkipNextIcon/>}>
          Next
        </Button>
      </Grid>
    </Grid>
  );
};