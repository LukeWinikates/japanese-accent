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
import {useHistory} from "react-router-dom";
import {idFrom} from "../YouTube/linkParser";

export function YouTubeVideoAddModal({open, onClose}: { open: boolean, onClose: () => void }) {
  const {logError} = useServerInteractionHistory();
  const history = useHistory();

  function createNewVideo() {
    if (videoUserInput === null || videoTitle === null) {
      return
    }
    post({
      youtubeId: idFrom(videoUserInput),
      title: videoTitle,
    }).then(() => {
      history.push('/media/' + idFrom(videoUserInput))
    }).catch(logError);
  }

  const {post} = useFetch(
    "/api/videos/");
  const [videoUserInput, setVideoUserInput] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);

  function handleUrlChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setVideoUserInput(event.target.value);
  }

  function handleTitleChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setVideoTitle(event.target.value);
  }

  function formInputIsValid() {
    return !!videoUserInput && !!videoTitle && !!idFrom(videoUserInput) && videoTitle.length > 0;
  }

  function videoUserInputValid() {
    return !!videoUserInput && !!idFrom(videoUserInput);
  }

  function videoTitleInputValid() {
    return !!videoTitle && videoTitle.length > 0;
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
          label="YouTube URL or ID"
          type="text"
          fullWidth
          value={videoUserInput}
          error={videoTitle !== null && !videoUserInputValid()}
          helperText="Must be a valid YouTube URL or Video ID"
          onChange={handleUrlChange}
        />
        <TextField
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          value={videoTitle}
          error={videoTitle !== null && !videoTitleInputValid()}
          helperText="You must specify a Title to import a video"
          onChange={handleTitleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={createNewVideo} color="primary" disabled={!formInputIsValid()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}