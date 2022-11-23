import React from "react";
import {makeStyles} from 'tss-react/mui';
import {DraftLabel, DraftSegment,} from "../../App/api";

const useStyles = makeStyles()((theme) => ({
  segmentSelector: {
    position: "absolute",
    display: "inline-flex",
    borderLeft: 1,
    borderRight: 1,
    borderColor: theme.palette.grey.A700,
    height: 100,
    cursor: "pointer",
    opacity: 0.5,

    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
      opacity: 0.25,
    }
  },
  muted: {
    backgroundColor: theme.palette.grey.A700
  },
  draft: {
    backgroundColor: theme.palette.primary.light
  },
  advice: {
    backgroundColor: theme.palette.grey.A400
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
  const {classes} = useStyles();
  const left = msToPixels(segment.startMS)
  const width = msToPixels(segment.endMS - segment.startMS)

  function colorForLabels(labels: DraftLabel[]) {
    if (!labels) {
      return classes.advice;
    }
    if (labels.some(l => l === "DRAFT")) {
      return classes.draft
    }
    if (labels.some(l => l === "MUTED")) {
      return classes.muted
    }
    return classes.advice;
  }

  return (
    <div className={`${classes.segmentSelector} ${colorForLabels(segment.labels)}`}
         style={{left, width}}
         onClick={onSelected}
    />
  );
}