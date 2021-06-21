import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {Segment} from "./api";
import {Button, DialogContent, IconButton, makeStyles, TextField} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import TrashIcon from '@material-ui/icons/Delete';

import useFetch from "use-http";
import DialogActions from "@material-ui/core/DialogActions";

export interface MediaSegmentsEditDialogProps {
  open: boolean;
  onClose: () => void;
  segment: Segment;
  setSegment: (segment: Segment) => void;
  videoId: string;
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
  const {onClose, open, videoId, segment, setSegment} = props;
  const {post, delete: destroy} = useFetch('/media/audio/' + videoId + "/segments/" + segment.uuid);
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  const save = () => {
    post(segment).then(onClose);
  };

  const del = () => {
    destroy().then(onClose);
  };

  const handleTextChange = (text: string) => {
    setSegment({
      ...segment,
      text
    });
  };

  const handleStartChange = (startString: string) => {
    const start = parseInt(startString);
    setSegment({
      ...segment,
      start
    });
  };

  const handleEndChange = (endString: string) => {
    const end = parseInt(endString);
    setSegment({
      ...segment,
      end
    });
  };


  return (
    <Dialog onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            disableEscapeKeyDown={false}
            open={open}
            maxWidth="sm"
            fullWidth={true}>
      <DialogTitle id="simple-dialog-title">
        Edit Audio Clip
        <IconButton aria-label="close" onClick={onClose} className={classes.closeButton}>
          <CloseIcon/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField label="start" onChange={(event) => handleStartChange(event.target.value)} value={segment.start}/>
        <TextField value={segment.text} fullWidth={true}
                   onChange={(event) => handleTextChange(event.target.value)}/>
        <TextField label="start" onChange={(event) => handleEndChange(event.target.value)} value={segment.end}/>


      </DialogContent>
      <DialogActions>
        <IconButton onClick={del}>
          <TrashIcon/>
        </IconButton>
        <Button onClick={save}>
          Save
        </Button>
      </DialogActions>
    </ Dialog>
  );
}

