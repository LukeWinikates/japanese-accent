import {SegmentEditor} from "../../Video/Segments/SegmentEditor";
import {Button, Stack} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, {useCallback} from "react";
import {Segment, SuggestedSegment} from "../../api/types";
import {suggestedSegmentsDELETE, videoSegmentPOST, videoSegmentPUT} from "../../api/ApiRoutes";
import DoneIcon from '@mui/icons-material/Done';
import {ARE_ADVICE} from "./segment";

type Props = {
  videoId: string,
  parentUuid: string | null,
  segment: Segment | SuggestedSegment,
  setSegment: (s: Segment | SuggestedSegment) => void
  onDelete: (s: SuggestedSegment) => void
};


export const Editor = ({segment, setSegment, videoId, parentUuid, onDelete}: Props) => {
  const saveClip = useCallback(() => {
    const apiCall = segment.labels.some(ARE_ADVICE) ? videoSegmentPOST : videoSegmentPUT;
    apiCall(videoId, {
      ...segment,
      parent: segment.labels.some(ARE_ADVICE) ? segment.uuid : parentUuid
    });
  }, [segment, videoId, parentUuid]);

  // TODO: this can delete real clips
  const hideSuggestedClip = useCallback(() => {
    suggestedSegmentsDELETE(videoId, segment.uuid).then(() => onDelete(segment))
  }, [segment, videoId, onDelete]);

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