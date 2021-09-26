import React, {useState} from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {Segment} from "../App/api";
import {Button, DialogContent, IconButton, makeStyles, TextField} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import TrashIcon from '@material-ui/icons/Delete';
import CopyIcon from '@material-ui/icons/FileCopy';

import useFetch from "use-http";
import DialogActions from "@material-ui/core/DialogActions";
import {Player} from "./Player";
import {TimeInput} from "./TimeInput";

export interface MediaSegmentsEditDialogProps {
  open: boolean;
  onClose: () => void;
  onDestroy: () => void;
  onAdd: (segment: Segment) => void;
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
  const {onClose, onDestroy, onAdd, open, videoId, segment, setSegment} = props;
  const {post, delete: destroy} = useFetch('/media/audio/' + videoId + "/segments/" + segment.uuid);
  const postClone = useFetch<Segment>('/media/audio/' + videoId + "/segments");
  const classes = useStyles();
  const [segmentIsPlaying, setSegmentIsPlaying] = useState<boolean>(false);


  const handleClose = () => {
    onClose();
  };

  const save = () => {
    post(segment).then(onClose);
  };

  const del = () => {
    destroy().then(onDestroy);
  };

  const clone = () => {
    let cloned = {
      text: segment.text,
      videoId: videoId,
      start: segment.start,
      end: segment.end,
    };
    postClone.post(cloned).then(response => {
      onAdd(response)
    });
  };

  const handleTextChange = (text: string) => {
    setSegment({
      ...segment,
      text
    });
  };

  const handleStartChange = (newStart: number) => {
    const start = newStart;
    setSegment({
      ...segment,
      start
    });
  };

  const handleEndChange = (newEnd: number) => {
    const end = newEnd;
    setSegment({
      ...segment,
      end
    });
  };

  function audioUrl() {
    return `/media/audio/${videoId}` + (segment ? `#t=${segment.start / 1000},${segment.end / 1000}` : "");
  }

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
        <Player src={audioUrl()}
                duration={{startSec: segment.start, endSec: segment.end}}
                playing={segmentIsPlaying}
                onPlayerStateChanged={setSegmentIsPlaying}
        />

        <TimeInput label="Start" onChange={handleStartChange} value={segment.start}/>
        <TimeInput label="End" onChange={handleEndChange} value={segment.end}/>
        <TextField margin="normal"
                   value={segment.text} fullWidth={true}
                   multiline={true}
                   onChange={(event) => handleTextChange(event.target.value)}/>

      </DialogContent>
      <DialogActions>
        <IconButton onClick={del}>
          <TrashIcon/>
        </IconButton>
        <IconButton onClick={clone}>
          <CopyIcon/>
        </IconButton>
        <Button onClick={save}>
          Save
        </Button>
      </DialogActions>
    </ Dialog>
  );
}

