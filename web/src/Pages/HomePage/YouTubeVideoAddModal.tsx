import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@material-ui/core";
import React, {useState} from "react";
import useFetch from "use-http";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";

export function YouTubeVideoAddModal({open, onClose}: { open: boolean, onClose: () => void }) {
  const {logError} = useServerInteractionHistory();

  function createNewVideo() {
    post({
      url: videoURL,
      title: videoTitle,
    }).then(onClose).catch(logError);
  }

  const {post} = useFetch(
    "/api/videos/");
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);

  function handleUrlChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setVideoURL(event.target.value);
  }

  function handleTitleChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setVideoTitle(event.target.value);
  }

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add YouTube video</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the YouTube URL here. You will be redirected to a page with the next steps.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="url"
          label="YouTube URL"
          type="text"
          fullWidth
          value={videoURL}
          onChange={handleUrlChange}
        />
        <TextField
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          value={videoTitle}
          onChange={handleTitleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={createNewVideo} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}