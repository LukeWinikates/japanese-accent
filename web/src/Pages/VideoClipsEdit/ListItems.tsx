import {Segment, SegmentLabel, SuggestedSegment} from "../../App/api";
import {ARE_ADVICE, ARE_MUTED} from "./segment";
import React, {CSSProperties} from "react";
import {IconButton, ListItemButton, ListItemIcon, ListItemSecondaryAction, Tooltip} from "@mui/material";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import {makeStyles} from 'tss-react/mui';
import ListItemText from "@mui/material/ListItemText";
import {rangeToHumanReadable} from "../../App/time";
import DeleteIcon from "@mui/icons-material/Delete";
import AudioFileIcon from '@mui/icons-material/AudioFile';

export function elementForLabels(labels: SegmentLabel[]) {
  if (!labels) {
    return DraftListItem
  }

  if (labels.some(ARE_MUTED)) {
    return MutedListItem;
  }

  if (labels.some(ARE_ADVICE)) {
    return SuggestedListItem;
  }
  return DraftListItem;
}

export const sizeForSegment = (segment: Segment | SuggestedSegment) => {
  return segment?.labels?.some(l => l === "MUTED") ? 12 : 52
}


type Params = {
  segment: Segment | SuggestedSegment,
  setSelectedSegment: (s: Segment | SuggestedSegment) => void,
  selected: boolean,
  index: number,
  style: CSSProperties,
  onDelete: (s: Segment | SuggestedSegment) => void,
};

const useStyles = makeStyles()((theme) => ({
  muted: {
    backgroundColor: theme.palette.grey.A400,
    overflow: "hidden",
    height: 10,
  },
  draft: {
    backgroundColor: theme.palette.success.light,
  },
  suggestion: {
    backgroundColor: theme.palette.info.light,
  }
}));

export function MutedListItem({segment, setSelectedSegment, selected, index, style}: Params) {

  const {classes} = useStyles();

  return (
    <Tooltip style={style} title="Muted Segment">
      <ListItemButton key={segment.uuid} className={classes.muted} divider={true} dense selected={selected}
                      onClick={() => setSelectedSegment(segment)}
      >
      </ListItemButton>
    </Tooltip>
  );
}


export function SuggestedListItem({segment, setSelectedSegment, selected, onDelete, style}: Params) {
  const {classes} = useStyles();

  return (
    <ListItemButton divider={true} style={style} key={segment.uuid} selected={selected} className={classes.suggestion}
                    onClick={() => setSelectedSegment(segment)}
    >
      <ListItemIcon>
        <LightbulbIcon/>
      </ListItemIcon>
      <ListItemText
        primary={`${rangeToHumanReadable(segment.startMS, segment.endMS)}`}
        secondary={segment.text}>
      </ListItemText>
      <IconButton edge="end" aria-label="delete" size="large">
        <DeleteIcon　onClick={() => onDelete(segment)}/>
      </IconButton>
    </ListItemButton>
  )
}


export function DraftListItem({segment, setSelectedSegment, selected, index, style}: Params) {
  const {classes} = useStyles();

  return (
    <ListItemButton style={style} key={segment.uuid} selected={selected}
                    className={classes.draft}
                    onClick={() => setSelectedSegment(segment)}
                    divider={true}
    >
      <ListItemIcon>
        <AudioFileIcon/>
      </ListItemIcon>
      <ListItemText
        primary={`${index + 1}: ${rangeToHumanReadable(segment.startMS, segment.endMS)}`}
        secondary={segment.text}
      >
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" size="large">
          <DeleteIcon/>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItemButton>
  )
}