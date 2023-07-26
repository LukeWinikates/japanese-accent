import {Clip} from "../api/types";
import React, {useCallback, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {useBackendAPI} from "../App/useBackendAPI";

type EditModalButtonProps = {
  clip: Clip,
  onDelete: () => void,
};

export function DeleteModalButton({clip, onDelete}: EditModalButtonProps) {
  const api = useBackendAPI();

  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => {
    setOpen(true)
  }, [setOpen]);

  const onClose = useCallback(async () => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmDelete = useCallback(async ()=> {
    api.videos.clips.DELETE(clip.videoUuid, clip.uuid)
      .then(onDelete)
    return onClose();
  }, [onClose, onDelete])

  return (
    <>
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={onOpen}
        size="large">
        <DeleteIcon/>
      </IconButton>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete this clip?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {clip.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Keep
          </Button>
          <Button onClick={onConfirmDelete}
                  color="primary" autoFocus>
            Destroy
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}