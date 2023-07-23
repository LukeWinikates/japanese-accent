import React, {useCallback} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {Clip} from "../../api/types";
import {Button, DialogContent, IconButton} from "@mui/material";
import {makeStyles} from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import TrashIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/FileCopy';
import DialogActions from "@mui/material/DialogActions";
import {ClipEditor} from "./ClipEditor";
import {useBackendAPI} from "../../App/useBackendAPI";

interface Props {
  open: boolean;
  onClose: () => void;
  onDestroy: () => void;
  onAdd: (clip: Clip) => void;
  clip: Clip;
  setClip: (clip: Clip) => void;
  videoId: string;
  previousClipEndMS: number;
  previousClipStartMS: number;
}

const useStyles = makeStyles<{}>()(theme => (
  {
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }
));

export function ClipEditorDialog(props: Props) {
  const {
    onClose,
    onDestroy,
    onAdd,
    open,
    videoId,
    clip,
    setClip,
    previousClipEndMS,
    previousClipStartMS
  } = props;
  const {classes} = useStyles({});
  const api = useBackendAPI();

  const onSave = useCallback(() => {
    api.videos.clips.PUT(videoId, clip)
      .then(onClose);
  }, [api.videos.clips, onClose, clip, videoId]);

  const onDelete = useCallback(() => {
    api.videos.clips.DELETE(videoId, clip.uuid).then(onDestroy);
  }, [api.videos.clips, clip, onDestroy, videoId]);

  const onClone = useCallback(() => {
    api.videos.clips.POST(videoId, {
      text: clip.text,
      videoUuid: videoId,
      startMS: clip.startMS,
      endMS: clip.endMS,
      parent: null,
      labels: [],
    })
      .then(response => onAdd(response.data))
  }, [api.videos.clips, videoId, clip, onAdd]);

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
        <ClipEditor<Clip>
          clip={clip}
          setClip={setClip}
          previousClipEndMS={previousClipEndMS}
          nextClipStartMS={previousClipStartMS}
          textSuggestions={[]}
        />
      </DialogContent>
      <DialogActions>
        <IconButton onClick={onDelete} size="large">
          <TrashIcon/>
        </IconButton>
        <IconButton onClick={onClone} size="large">
          <CopyIcon/>
        </IconButton>
        <Button onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </ Dialog>
  );
}

