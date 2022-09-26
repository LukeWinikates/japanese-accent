import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import {DraftSegment,} from "../../App/api";

const useStyles = makeStyles((theme) => ({
  segmentSelector: {
    position: "absolute",
    display: "inline-flex",
    // top: 0,
    height: 100,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
      opacity: 0.25,
    }
  }
}));

type Props = {
  segment: DraftSegment,
  onSelected: () => void
  selected: boolean,
  msToPixels: (px: number) => number,
};

export function SegmentSelector({
                                  segment,
                                  onSelected,
                                  msToPixels
                                }: Props) {
  const styles = useStyles();
  const left = msToPixels(segment.startMS)
  const width = msToPixels(segment.endMS - segment.startMS)
  return (
    <div className={styles.segmentSelector}
         style={{left, width}}
         onClick={onSelected}
    />
  );
}