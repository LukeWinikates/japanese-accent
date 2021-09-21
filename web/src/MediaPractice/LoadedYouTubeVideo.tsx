import {duration, Segment, Video} from "../api";
import React, {useEffect, useState} from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  Typography
} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import EditIcon from "@material-ui/core/SvgIcon";
import {Dictaphone} from "./Dictaphone";
import {MediaSegmentEditDialog} from "./MediaSegmentEditDialog";
import useFetch from "use-http";
import DeleteIcon from '@material-ui/icons/Delete';
import YouTubeIcon from '@material-ui/icons/YouTube';
import LaunchIcon from '@material-ui/icons/Launch';

export const LoadedYouTubeVideo = ({video, onVideoChange}: { video: Video, onVideoChange: (v: Video) => void }) => {
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [promptingSegmentDelete, setPromptingSegmentDelete] = useState<{ segment: Segment, index: number } | null>(null);
  const [currentSegment, setCurrentSegment] = useState<Segment | null>(video.segments[0]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const lastIndex = video.segments.length - 1;

  const {delete: destroy} = useFetch<Segment>(
    '/media/audio/' + video.videoId + "/segments");

  function pauseAll() {
    document.querySelectorAll("audio").forEach(a => a.pause());
  }

  useEffect(() => {
    setCurrentSegment(video.segments[0])
  }, [video])

  async function handleModalClose() {
    if (editingSegment === null) {
      return;
    }
    const editedSegment = editingSegment;
    let newSegments = [...video.segments];
    newSegments.splice(currentSegmentIndex, 1, editedSegment);
    setEditingSegment(null);
    onVideoChange({
      ...video,
      segments: newSegments
    });
    setCurrentSegment(editedSegment);
  }

  function removeCurrentSegment() {
    setEditingSegment(null);
    removeSegmentByIndex(currentSegmentIndex);
  }

  function removeSegmentByIndex(index: number) {
    let newSegments = [...video.segments];
    newSegments.splice(index, 1);
    setVideoSegments(newSegments);
    if (currentSegmentIndex === index) {
      setSegmentByIndex(currentSegmentIndex - 1);
    }
  }

  function setVideoSegments(newSegments: Segment[]) {
    onVideoChange({
      ...video,
      segments: newSegments
    });
  }

  function addSegment(newSegment: Segment) {
    let newSegments = [...video.segments];
    newSegments.splice(currentSegmentIndex + 1, 0, newSegment)
    setVideoSegments(newSegments);
  }

  function setSegmentByIndex(newIndex: number) {
    let segment = video.segments[newIndex];
    setCurrentSegmentIndex(newIndex);
    setCurrentSegment(segment);
  }

  function promptToDelete(segment: Segment, index: number) {
    setPromptingSegmentDelete({segment, index});
  }

  let renderRow = (segment: Segment, index: number) => {
    return (
      <ListItem key={index}
                selected={currentSegmentIndex === index}
                alignItems="flex-start"
                onClick={() => {
                  pauseAll();
                  setCurrentSegment(segment);
                  setCurrentSegmentIndex(index);
                }}
      >
        <ListItemText
          primaryTypographyProps={{noWrap: true, variant: "body2"}}
          primary={segment.text}
          secondary={Math.round(duration(segment)) + "s"}
        >
        </ListItemText>
        <ListItemSecondaryAction>
          <Button endIcon={<EditIcon/>} onClick={() => setEditingSegment(currentSegment)}>
            Edit
          </Button>
          <IconButton edge="end" aria-label="delete" onClick={() => promptToDelete(segment, index)}>
            <DeleteIcon/>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  function destroySegment(segment: Segment, index: number) {
    destroy('/' + segment.uuid)
      .then(() => removeSegmentByIndex(index))
      .then(() => setPromptingSegmentDelete(null));
  }

  return (
    <Box m={2}>
      <Container maxWidth='lg'>
        <Breadcrumbs aria-label="breadcrumb">
        </Breadcrumbs>

        <Box paddingY={2} margin={0}>
          <Typography variant="h2">
            {video.title}
          </Typography>
          <Button href={video.url} color="secondary" target="_blank"
                  startIcon={<YouTubeIcon/>} variant="text"
                  endIcon={<LaunchIcon fontSize="small"/>}>
            Open in YouTube
          </Button>
        </Box>

        <Card>
          <CardContent>
            {currentSegment &&
            <Dictaphone
              videoId={video.videoId}
              segment={currentSegment}
              setSegmentByIndex={setSegmentByIndex}
              lastSegmentIndex={lastIndex}
              segmentIndex={currentSegmentIndex}/>
            }
          </CardContent>
        </Card>

        <Box paddingY={2} margin={0}>
          <List>
            {
              video.segments.map(renderRow)
            }
          </List>

          {
            editingSegment !== null &&
            <MediaSegmentEditDialog
              open={!!editingSegment}
              onClose={handleModalClose}
              onDestroy={removeCurrentSegment}
              onAdd={addSegment}
              segment={editingSegment}
              setSegment={setEditingSegment}
              videoId={video.videoId}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            />
          }

          {
            promptingSegmentDelete !== null &&
            <Dialog
              open={true}
              onClose={() => setPromptingSegmentDelete(null)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Delete this segment?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {promptingSegmentDelete.segment.text}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setPromptingSegmentDelete(null)} color="primary">
                  Keep
                </Button>
                <Button onClick={() => destroySegment(promptingSegmentDelete.segment, promptingSegmentDelete.index)}
                        color="primary" autoFocus>
                  Destroy
                </Button>
              </DialogActions>
            </Dialog>
          }
        </Box>
      </Container>
    </Box>
  );
};