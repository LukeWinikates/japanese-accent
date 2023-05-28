import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {Segment} from "../../api/types";
import {Button, DialogContent, IconButton} from "@mui/material";
import {makeStyles} from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import TrashIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/FileCopy';
import DialogActions from "@mui/material/DialogActions";
import {SegmentEditor} from "./SegmentEditor";
import {useBackendAPI} from "../../App/useBackendAPI";

export interface MediaSegmentsEditDialogProps {
  open: boolean;
  onClose: () => void;
  onDestroy: () => void;
  onAdd: (segment: Segment) => void;
  segment: Segment;
  setSegment: (segment: Segment) => void;
  videoId: string;
  previousSegmentEnd: number;
  nextSegmentStart: number;
}

const useStyles = makeStyles()(theme => (
  {
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }
));

export function MediaSegmentEditDialog(props: MediaSegmentsEditDialogProps) {
  const {
    onClose,
    onDestroy,
    onAdd,
    open,
    videoId,
    segment,
    setSegment,
    previousSegmentEnd,
    nextSegmentStart
  } = props;
  const {classes} = useStyles();
  const api = useBackendAPI();

  const save = () => {
    api.videos.clips.PUT(videoId, segment)
      .then(onClose);
  };

  const del = () => {
    api.videos.clips.DELETE(videoId, segment.uuid).then(onDestroy);
  };

  const clone = () => {
    api.videos.clips.POST(videoId, {
      text: segment.text,
      videoUuid: videoId,
      startMS: segment.startMS,
      endMS: segment.endMS,
      parent: null,
      labels: [],
    })
      .then(response => onAdd(response.data))
  };

  return (
    <Dialog onClose={onClose}
            aria-labelledby="simple-dialog-title"
            disableEscapeKeyDown={false}
            open={open}
            maxWidth="sm"
            fullWidth={true}>
      <DialogTitle id="simple-dialog-title">
        Edit Audio Clip
        <IconButton
          aria-label="close"
          onClick={onClose}
          className={classes.closeButton}
          size="large">
          <CloseIcon/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <SegmentEditor
          segment={segment}
          setSegment={setSegment}
          previousSegmentEnd={previousSegmentEnd}
          nextSegmentStart={nextSegmentStart}
        />
      </DialogContent>
      <DialogActions>
        <IconButton onClick={del} size="large">
          <TrashIcon/>
        </IconButton>
        <IconButton onClick={clone} size="large">
          <CopyIcon/>
        </IconButton>
        <Button onClick={save}>
          Save
        </Button>
      </DialogActions>
    </ Dialog>
  );
}

