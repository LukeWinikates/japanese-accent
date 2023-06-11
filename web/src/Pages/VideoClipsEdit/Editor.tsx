import {SegmentEditor} from "../../Video/Segments/SegmentEditor";
import {Button, Stack} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, {useCallback} from "react";
import {BasicClip} from "../../api/types";
import DoneIcon from '@mui/icons-material/Done';
import {ARE_ADVICE} from "./segment";
import {useBackendAPI} from "../../App/useBackendAPI";

type Props = {
  videoId: string,
  segment: BasicClip,
  setSegment: (s: BasicClip) => void
  onDelete: (s: BasicClip) => void
};

export const Editor = ({segment, setSegment, videoId, onDelete}: Props) => {
  const api = useBackendAPI();
  const saveClip = useCallback(() => {
    if (segment.labels.some(ARE_ADVICE)) {
      return api.videos.clips.POST(videoId, {
        endMS: segment.endMS,
        labels: [],
        startMS: segment.startMS,
        text: segment.text,
        videoUuid: segment.videoUuid,
        parent: segment.uuid
      })
    }

    return api.videos.clips.PUT(videoId, {
      uuid: segment.uuid,
      endMS: segment.endMS,
      labels: [],
      startMS: segment.startMS,
      text: segment.text,
      videoUuid: segment.videoUuid
    })
  }, [segment, videoId, api.videos.clips]);

  const hideSuggestedClip = useCallback(() => {
    if (segment.labels.some(ARE_ADVICE)) {
      return api.videos.advice.suggestedClips.DELETE(videoId, segment.uuid)
        .then(() => onDelete(segment));
    }
    return api.videos.clips.DELETE(videoId, segment.uuid).then(() => onDelete(segment))
  }, [segment, videoId, onDelete, api.videos.advice.suggestedClips, api.videos.clips]);

  return (
    <>
      <SegmentEditor
        segment={segment}
        setSegment={setSegment}
        previousSegmentEnd={null}
        nextSegmentStart={null}
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