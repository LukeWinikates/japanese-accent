import {SegmentEditor} from "../../Video/Segments/SegmentEditor";
import {Button, Stack} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, {useCallback} from "react";
import {Segment, SuggestedSegment} from "../../App/api";
import {suggestedSegmentsDELETE, videoSegmentPOST, videoSegmentPUT} from "../../App/ApiRoutes";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import DoneIcon from '@mui/icons-material/Done';

type Props = {
  videoId: string,
  parentUuid: string | null,
  segment: Segment | SuggestedSegment,
  setSegment: (s: Segment | SuggestedSegment) => void
  onDelete: (s: SuggestedSegment) => void
};

export const Editor = ({segment, setSegment, videoId, parentUuid, onDelete}: Props) => {
  const {logError} = useServerInteractionHistory();

  const saveClip = useCallback(() => {
    const apiCall = segment.uuid ? videoSegmentPOST : videoSegmentPUT;
    apiCall(videoId, {
      ...segment,
      parent: parentUuid
    }).catch(logError);
  }, [segment, videoId, logError]);

  const hideSuggestedClip = useCallback(() => {
    suggestedSegmentsDELETE(videoId, segment.uuid).then(() => onDelete(segment)).catch(logError);
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