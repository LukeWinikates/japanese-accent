import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import React, {useState} from "react";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import {useNavigate} from "react-router-dom";
import {idFrom} from "../YouTube/linkParser";
import axios from "axios";

export function YouTubeVideoAddModal({open, onClose}: { open: boolean, onClose: () => void }) {
  const {logError} = useServerInteractionHistory();
  const navigate = useNavigate();

  function createNewVideo() {
    if (videoUserInput === null || videoTitle === null) {
      return
    }
    axios.post("api/videos",{
      youtubeId: idFrom(videoUserInput),
      title: videoTitle,
    }).then(() => {
      navigate('/media/' + idFrom(videoUserInput))
    }).catch(logError);
  }

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