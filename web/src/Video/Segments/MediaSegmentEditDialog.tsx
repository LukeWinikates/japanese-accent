import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {Segment} from "../../App/api";
import {Button, DialogContent, IconButton} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import TrashIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/FileCopy';

import useFetch from "use-http";
import DialogActions from "@mui/material/DialogActions";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import {SegmentEditor} from "./SegmentEditor";

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

const useStyles = makeStyles(theme => (
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
  const {put, delete: destroy} = useFetch('/api/videos/' + videoId + "/segments/" + segment.uuid);
  const {logError} = useServerInteractionHistory();
  const {post: createSegmentPOST} = useFetch<Segment>('/api/videos/' + videoId + "/segments");
  const classes = useStyles();

  const save = () => {
    put(segment).then(onClose);
  };

  const del = () => {
    destroy().then(onDestroy);
  };

  const clone = () => {
    let cloned = {
      text: segment.text,
      videoUuid: videoId,
      start: segment.startMS,
      end: segment.endMS,
    };
    createSegmentPOST(cloned).then(response => {
      onAdd(response)
    }).catch(logError);
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

