import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {makeStyles} from 'tss-react/mui';
import CloseIcon from "@mui/icons-material/Close";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import {SegmentEditor} from "./SegmentEditor";
import {videoSegmentPOST} from "../../App/ApiRoutes";

type DraftSegmentDialogProps = { videoId: string, onClose: () => void };

type DraftSegment = {
  startMS: number,
  endMS: number,
  text: string,
  videoUuid: string,
}

const useStyles = makeStyles()(theme => (
  {
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }
));
const DraftSegmentDialog = ({videoId, onClose}: DraftSegmentDialogProps) => {
  const [segment, setSegment] = useState<DraftSegment>({
    videoUuid: videoId,
    startMS: 0,
    endMS: 1000,
    text: "",
  })
  const {classes} = useStyles();
  const {logError} = useServerInteractionHistory();

  function save() {
    videoSegmentPOST(videoId, {
      text: segment.text,
      videoUuid: videoId,
      start: segment.startMS,
      end: segment.endMS,
    }).then(onClose).catch(logError);
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
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
        <SegmentEditor segment={segment} setSegment={setSegment} previousSegmentEnd={null} nextSegmentStart={null}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={save}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DraftSegmentDialog