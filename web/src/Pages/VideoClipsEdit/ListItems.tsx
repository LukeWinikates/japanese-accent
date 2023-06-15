import {BasicClip, Clip, ClipLabel} from "../../api/types";
import {ARE_ADVICE, ARE_MUTED} from "./clipLabels";
import React, {CSSProperties, useCallback} from "react";
import {IconButton, ListItemButton, ListItemIcon, ListItemSecondaryAction, Tooltip} from "@mui/material";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import {makeStyles} from 'tss-react/mui';
import ListItemText from "@mui/material/ListItemText";
import {rangeToHumanReadable} from "../../App/time";
import DeleteIcon from "@mui/icons-material/Delete";
import AudioFileIcon from '@mui/icons-material/AudioFile';

export function elementForLabels(labels: ClipLabel[]) {
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

export const sizeForClip = (clip: Clip | BasicClip, showMuted: boolean) => {
  const mutedSize = showMuted ? 12 : 0;
  return clip?.labels?.some(l => l === "MUTED") ?
    mutedSize :
    52
}

type Params = {
  clip: Clip | BasicClip,
  setSelectedClip: (s: Clip | BasicClip) => void,
  selected: boolean,
  index: number,
  style: CSSProperties,
  showMuted: boolean,
  onDelete: (s: Clip | BasicClip) => void,
};

const useStyles = makeStyles<{}>()((theme) => ({
  muted: {
    backgroundColor: theme.palette.grey.A400,
    overflow: "hidden",
    height: 10,
  },
  zeroHeight: {
    height: 0,
  },
  draft: {
    backgroundColor: theme.palette.success.light,
  },
  suggestion: {
    backgroundColor: theme.palette.info.light,
  }
}));

export function MutedListItem({clip, setSelectedClip, selected, style, showMuted}: Params) {
  const {classes} = useStyles({});

  const classNames = [classes.muted, showMuted ? null : classes.zeroHeight].join(" ")

  const onClick = useCallback(() => {
    setSelectedClip(clip);
  }, [clip, setSelectedClip]);

  return (
    <Tooltip style={style} title="Muted Clip">
      <ListItemButton key={clip.uuid} className={classNames} divider={false} dense selected={selected}
                      onClick={onClick}
      >
      </ListItemButton>
    </Tooltip>
  );
}


export function SuggestedListItem({clip, setSelectedClip, selected, onDelete, style}: Params) {
  const {classes} = useStyles({});
  const deleteCallback = useCallback(() => {
    onDelete(clip)
  }, [onDelete, clip])

  const onClick = useCallback(() => {
    setSelectedClip(clip);
  }, [clip, setSelectedClip]);

  return (
    <ListItemButton divider={true} style={style} key={clip.uuid} selected={selected} className={classes.suggestion}
                    onClick={onClick}
    >
      <ListItemIcon>
        <LightbulbIcon/>
      </ListItemIcon>
      <ListItemText
        primary={`${rangeToHumanReadable(clip.startMS, clip.endMS)}`}
        secondary={clip.text}>
      </ListItemText>
      <IconButton onClick={deleteCallback} edge="end" aria-label="delete" size="large">
        <DeleteIcon/>
      </IconButton>
    </ListItemButton>
  )
}


export function DraftListItem({clip, setSelectedClip, selected, index, style}: Params) {
  const {classes} = useStyles({});

  const onClick = useCallback(() => {
    setSelectedClip(clip);
  }, [clip, setSelectedClip]);

  return (
    <ListItemButton style={style} key={clip.uuid} selected={selected}
                    className={classes.draft}
                    onClick={onClick}
                    divider={true}
    >
      <ListItemIcon>
        <AudioFileIcon/>
      </ListItemIcon>
      <ListItemText
        primary={`${index + 1}: ${rangeToHumanReadable(clip.startMS, clip.endMS)}`}
        secondary={clip.text}
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