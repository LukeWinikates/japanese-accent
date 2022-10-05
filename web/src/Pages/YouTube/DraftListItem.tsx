import {DraftSegment} from "../../App/api";
import {Checkbox, IconButton, ListItemButton, ListItemIcon, ListItemSecondaryAction} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import {rangeToHumanReadable} from "../../App/time";
import DeleteIcon from "@mui/icons-material/Delete";
import NotesIcon from "@mui/icons-material/Notes";
import CopyIcon from "@mui/icons-material/FileCopy";
import React from "react";

type Params = { segment: DraftSegment, setSelectedSegment: (s: DraftSegment) => void, selected: boolean, index: number };

export function DraftListItem({segment, setSelectedSegment, selected, index}: Params) {
  const labelId = `checkbox-list-label-${index}`;

  return (
    <ListItemButton key={segment.uuid} selected={selected}
                    onClick={() => setSelectedSegment(segment)}>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={false}
          tabIndex={-1}
          disableRipple
          inputProps={{'aria-labelledby': labelId}}
        />
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
        <IconButton edge="end" aria-label="edit" size="large">
          <NotesIcon/>
        </IconButton>
        <IconButton edge="end" aria-label="copy" size="large">
          <CopyIcon/>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItemButton>
  )
}