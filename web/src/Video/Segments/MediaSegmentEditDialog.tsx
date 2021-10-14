import React, {useEffect, useState} from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {Segment} from "../../App/api";
import {Button, DialogContent, IconButton, makeStyles, TextField} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import TrashIcon from '@material-ui/icons/Delete';
import CopyIcon from '@material-ui/icons/FileCopy';

import useFetch from "use-http";
import DialogActions from "@material-ui/core/DialogActions";
import {Player} from "../../Dictaphone/Player";
import {TimeInput} from "./TimeInput";
import {msToHumanReadable} from "../../App/time";

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

export function MediaSegmentEditDialog({onClose, onDestroy, onAdd, open, videoId, segment, setSegment, previousSegmentEnd, nextSegmentStart}: MediaSegmentsEditDialogProps) {
  const {put, delete: destroy} = useFetch('/api/videos/' + videoId + "/segments/" + segment.uuid);
  const postClone = useFetch<Segment>('/api/videos/' + videoId + "/segments");
  const classes = useStyles();
  const [segmentIsPlaying, setSegmentIsPlaying] = useState<boolean>(false);
  const [preferredStartTime, setPreferredStartTime] = useState<number|undefined>(undefined);
  const [playerStartDebounce, setPlayerStartDebounce] = useState<Date | undefined>();

  useEffect(()=>{
    if(!playerStartDebounce) {
      return
    }
    const timer = setTimeout(() => {
      setSegmentIsPlaying(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [playerStartDebounce])

  const handleClose = () => {
    onClose();
  };

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
    const end = start >= segment.end ? start + 1000 : segment.end
    setSegment({
      ...segment,
      start,
      end
    });
  };

  const handleEndChange = (newEnd: number) => {
    const end = newEnd;
    setSegment({
      ...segment,
      end
    });
    setPreferredStartTime(newEnd - 1000);
    setPlayerStartDebounce(new Date())
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
                preferredStartTime={preferredStartTime}
        />

        <TimeInput label="Start" onChange={handleStartChange} value={segment.start}/>
        <Button onClick={() => handleStartChange(previousSegmentEnd)}>
          Align Start to Previous Segment End: {msToHumanReadable(previousSegmentEnd)}
        </Button>

        <TimeInput label="End" onChange={handleEndChange} value={segment.end}/>
        <Button onClick={() => handleEndChange(nextSegmentStart)}>
          Align End to Next Segment Start: {msToHumanReadable(nextSegmentStart)}
        </Button>
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

