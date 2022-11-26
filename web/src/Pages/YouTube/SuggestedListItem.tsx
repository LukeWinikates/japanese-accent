import {Segment, SuggestedSegment} from "../../App/api";
import {ListItemButton} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import {rangeToHumanReadable} from "../../App/time";
import React, {CSSProperties} from "react";

type Params = {
  segment: Segment | SuggestedSegment,
  setSelectedSegment: (s: Segment | SuggestedSegment) => void,
  selected: boolean,
  index: number,
  style: CSSProperties,
};

export function SuggestedListItem({segment, setSelectedSegment, selected, index, style}: Params) {
  return (
    <ListItemButton divider={true} style={style} key={segment.uuid} selected={selected}
                    onClick={() => setSelectedSegment(segment)}
    >
      <ListItemText
        primary={`${rangeToHumanReadable(segment.startMS, segment.endMS)}`}
        secondary={segment.text}>
      </ListItemText>
    </ListItemButton>
  )
}