import {DraftSegment} from "../../App/api";
import {Checkbox, IconButton, ListItemButton, ListItemIcon, ListItemSecondaryAction} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import {rangeToHumanReadable} from "../../App/time";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffSharp';
import React, {CSSProperties, useCallback} from "react";
import {draftSegmentsPOST, suggestedSegmentsDELETE} from "../../App/ApiRoutes";
import {makeStyles} from 'tss-react/mui';

type Params = {
  segment: DraftSegment,
  setSelectedSegment: (s: DraftSegment) => void,
  selected: boolean,
  index: number,
  videoId: string,
  style: CSSProperties,
  onAddDraft: (s: DraftSegment) => void,
  onMute: (s: DraftSegment) => void,
};

const useStyles = makeStyles()((theme) => ({
  underline: {
    borderBottom: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.grey["500"],
  }
}));

export function SuggestedListItem({segment, setSelectedSegment, onAddDraft, onMute, selected, index, style, videoId}: Params) {
  const labelId = `checkbox-list-label-${index}`;

  const createDraftFromSegment = useCallback(() => {
    draftSegmentsPOST(videoId, {
      ...segment,
      labels: ["DRAFT"],
      parent: segment.uuid
    }).then(() => {
      onAddDraft(segment)
    });
  }, [segment, videoId, onAddDraft]);

  const hideSuggestion = useCallback(() => {
    suggestedSegmentsDELETE(videoId, segment.uuid).then(() => {
      onMute(segment)
    });
  }, [segment, videoId, onMute]);

  const {classes} = useStyles();

  return (
    <ListItemButton style={style} key={segment.uuid} selected={selected}
                    onClick={() => setSelectedSegment(segment)}
                    className={classes.underline}
    >
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
        <IconButton edge="end" aria-label="hide" size="large" onClick={hideSuggestion}>
          <VisibilityOffIcon/>
        </IconButton>
        <IconButton edge="end" aria-label="add" size="large" onClick={createDraftFromSegment}>
          <AddIcon/>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItemButton>
  )
}