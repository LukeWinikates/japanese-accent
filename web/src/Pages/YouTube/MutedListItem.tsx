import {Segment, SuggestedSegment} from "../../App/api";
import React, {CSSProperties} from "react";
import {ListItemButton, Tooltip} from "@mui/material";
import {makeStyles} from 'tss-react/mui';

type Params = {
  segment: Segment | SuggestedSegment,
  setSelectedSegment: (s: Segment | SuggestedSegment) => void,
  selected: boolean,
  index: number,
  style: CSSProperties
};
const useStyles = makeStyles()((theme) => ({
  foo: {
    backgroundColor: theme.palette.grey.A200,
  }
}));

export function MutedListItem({segment, setSelectedSegment, selected, index, style}: Params) {

  const {classes} = useStyles();

  return (
    <Tooltip style={style} title="Muted Segment">
      <ListItemButton key={segment.uuid} className={classes.foo} divider={true} dense selected={selected}
                      onClick={() => setSelectedSegment(segment)}
      >
      </ListItemButton>
    </Tooltip>
  );
}