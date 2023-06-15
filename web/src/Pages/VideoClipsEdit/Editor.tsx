import {ClipEditor} from "../../Video/Clips/ClipEditor";
import {Button, Stack} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, {useCallback} from "react";
import {BasicClip} from "../../api/types";
import DoneIcon from '@mui/icons-material/Done';
import {ARE_ADVICE} from "./clipLabels";
import {useBackendAPI} from "../../App/useBackendAPI";

type Props = {
  videoId: string,
  clip: BasicClip,
  setClip: (c: BasicClip) => void
  onDelete: (c: BasicClip) => void
};

export const Editor = ({clip, setClip, videoId, onDelete}: Props) => {
  const api = useBackendAPI();
  const saveClip = useCallback(() => {
    if (clip.labels.some(ARE_ADVICE)) {
      return api.videos.clips.POST(videoId, {
        endMS: clip.endMS,
        labels: [],
        startMS: clip.startMS,
        text: clip.text,
        videoUuid: clip.videoUuid,
        parent: clip.uuid
      })
    }

    return api.videos.clips.PUT(videoId, {
      uuid: clip.uuid,
      endMS: clip.endMS,
      labels: [],
      startMS: clip.startMS,
      text: clip.text,
      videoUuid: clip.videoUuid
    })
  }, [clip, videoId, api.videos.clips]);

  const hideSuggestedClip = useCallback(() => {
    if (clip.labels.some(ARE_ADVICE)) {
      return api.videos.advice.suggestedClips.DELETE(videoId, clip.uuid)
        .then(() => onDelete(clip));
    }
    return api.videos.clips.DELETE(videoId, clip.uuid).then(() => onDelete(clip))
  }, [clip, videoId, onDelete, api.videos.advice.suggestedClips, api.videos.clips]);

  return (
    <>
      <ClipEditor
        clip={clip}
        setClip={setClip}
        previousClipEndMS={null}
        nextClipStartMS={null}
      />

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
      >
        <Button variant="contained"
                color="info"
                aria-label="Hide"
                size="large"
                onClick={hideSuggestedClip}
                endIcon={<DeleteIcon/>}>
          Hide
        </Button>
        <Button variant="contained"
                color="primary"
                aria-label="Finish"
                size="large"
                endIcon={<DoneIcon/>}
                onClick={saveClip}>
          Save
        </Button>
      </Stack>
    </>
  );
}