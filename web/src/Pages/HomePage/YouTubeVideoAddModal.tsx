import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import React, {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import {idFrom} from "../YouTube/linkParser";
import {useBackendAPI} from "../../App/useBackendAPI";

export function YouTubeVideoAddModal({open, onClose}: { open: boolean, onClose: () => void }) {
  const navigate = useNavigate();
  const api = useBackendAPI();
  const [videoUserInput, setVideoUserInput] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);

  const createNewVideo = useCallback(() => {
    if (videoUserInput === null || videoTitle === null) {
      return;
    }
    let youtubeId = idFrom(videoUserInput);
    if (youtubeId == null) {
      return
    }
    api.videos.POST({
      youtubeId: youtubeId,
      title: videoTitle,
    }).then(() => {
      navigate('/media/' + youtubeId)
    });
  }, [api.videos, navigate, videoTitle, videoUserInput]);

  const handleUrlChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setVideoUserInput(event.target.value);
  }, [setVideoUserInput]);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setVideoTitle(event.target.value);
  }, [setVideoTitle]);

  const formInputIsValid = useCallback(() => {
    return !!videoUserInput && !!videoTitle && !!idFrom(videoUserInput) && videoTitle.length > 0;
  }, [videoUserInput, videoTitle]);

  const videoUserInputValid = () => {
    return !!videoUserInput && !!idFrom(videoUserInput);
  };

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