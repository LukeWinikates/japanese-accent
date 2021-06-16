import React, {useState} from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {Segment} from "./api";
import {Button, createStyles, IconButton, TextField, Theme, WithStyles} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

import useFetch from "use-http";
import withStyles from "@material-ui/core/styles/withStyles";

export interface MediaSegmentsEditDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  segment: Segment;
  videoId: string;
}

const styles = (theme: Theme) => (
  createStyles({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })
);

interface MSEDialogTitleProps extends WithStyles<typeof styles> {
  // id: string;
  // children: React.ReactNode;
  onClose: () => void;
}

const MSEDialogTitle = withStyles(styles)((props: MSEDialogTitleProps) => {
  const {classes, onClose} = props;

  return <DialogTitle id="simple-dialog-title">
    Edit Audio Clip
    <IconButton aria-label="close" onClick={onClose} className={classes.closeButton}>
      <CloseIcon/>
    </IconButton>
  </DialogTitle>
})

export function MediaSegmentEditDialog(props: MediaSegmentsEditDialogProps) {
  const {onClose, open, videoId, segment: seg} = props;
  const [segment, setSegment] = useState<Segment>({...seg});
  const {post, response} = useFetch('/media/audio/' + videoId + "/segments/" + segment.uuid);

  console.log(props.segment);
  console.log(segment);

  const handleClose = () => {
    onClose("");
  };

  const save = () => {
    post(segment).catch(console.log);
  };

  const handleTextChange = (text: string) => {
    setSegment({
      ...segment,
      text
    });
  };
  return (
    <Dialog onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            disableEscapeKeyDown={false}
            open={open}
            maxWidth="sm"
            fullWidth={true}>
      <MSEDialogTitle onClose={handleClose}/>
      <TextField value={segment.text} fullWidth={true}
                 onChange={(event) => handleTextChange(event.target.value)}/>

      <Button onClick={save}>
        Save
      </Button>
    </ Dialog>
  );
}

