import {DraftSegment} from "../../App/api";
import React, {CSSProperties} from "react";
import {makeStyles} from "tss-react/mui";

type Params = { segment: DraftSegment, setSelectedSegment: (s: DraftSegment) => void, selected: boolean, index: number, style: CSSProperties };

const useStyles = makeStyles()((theme) => ({
  underline: {
    backgroundColor: theme.palette.grey.A700,
  }
}));

export function MutedListItem({segment, setSelectedSegment, selected, index, style}: Params) {
  const {classes} = useStyles();

  return (
    <div style={style} key={segment.uuid}
                    className={classes.underline}
    >

    </div>
  )
}