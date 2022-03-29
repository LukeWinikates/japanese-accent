import {duration, Export, Segment} from "../App/api";
import React, {useEffect, useRef, useState} from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  Typography
} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import EditIcon from "@material-ui/core/SvgIcon";
import {Dictaphone} from "./Dictaphone";
import {MediaSegmentEditDialog} from "../Video/Segments/MediaSegmentEditDialog";
import useFetch, {CachePolicies} from "use-http";
import DeleteIcon from '@material-ui/icons/Delete';
import {PitchDetails} from "./PitchDetails";
import {PagingTitle} from "./PagingTitle";
import {Pager} from "./Pager";
import {useInterval} from "../App/useInterval";

type PlaylistPlayerProps = { segments: Segment[], onSegmentsChange: (segments: Segment[]) => void, parentId: string };

export const PlaylistPlayer = ({segments, onSegmentsChange, parentId}: PlaylistPlayerProps) => {
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [promptingSegmentDelete, setPromptingSegmentDelete] = useState<{ segment: Segment, index: number } | null>(null);
  const [currentSegment, setCurrentSegment] = useState<Segment | null>(segments[0]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [watchingExport, setWatchingExport] = useState(false);
  const [exportProgress, setExportProgress] = useState<Export | null>(null);
  let segmentsProgress = (currentSegmentIndex + 1) / segments.length * 100;

  const {delete: destroy} = useFetch<Segment>(
    '/api/videos/');

  const exportsAPI = useFetch(
    '/api/exports', {cachePolicy: CachePolicies.NO_CACHE});

  function pauseAll() {
    document.querySelectorAll("audio").forEach(a => a.pause());
  }

  useEffect(() => {
    setCurrentSegment(segments[0])
    setCurrentSegmentIndex(0);
  }, [parentId]);

  const listRef = useRef<HTMLElement>();

  useEffect(() => {
    listRef.current?.querySelectorAll(`li`)[currentSegmentIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [currentSegmentIndex])

  useInterval(() => {
    exportsAPI.get(parentId).then((e: Export) => {
      setExportProgress(e);
      e.done && setWatchingExport(false)
    });
  }, watchingExport ? 200 : null);

  async function handleModalClose() {
    if (editingSegment === null) {
      return;
    }
    const editedSegment = editingSegment;
    let newSegments = [...segments];
    newSegments.splice(currentSegmentIndex, 1, editedSegment);
    setEditingSegment(null);
    onSegmentsChange(newSegments);
    setCurrentSegment(editedSegment);
  }

  function removeCurrentSegment() {
    setEditingSegment(null);
    removeSegmentByIndex(currentSegmentIndex);
  }

  function mutateSegmentAtIndex(index: number, newValue: Segment) {
    const newSegments = [...segments];
    newSegments[index] = newValue;
    onSegmentsChange(newSegments);
    if (index === currentSegmentIndex) {
      setCurrentSegment(newValue);
    }
  }

  function removeSegmentByIndex(index: number) {
    let newSegments = [...segments];
    newSegments.splice(index, 1);
    onSegmentsChange(newSegments);
    if (currentSegmentIndex === index) {
      setSegmentByIndex(currentSegmentIndex - 1);
    }
  }

  function addSegment(newSegment: Segment) {
    let newSegments = [...segments];
    newSegments.splice(currentSegmentIndex + 1, 0, newSegment)
    onSegmentsChange(newSegments);
  }

  function setSegmentByIndex(newIndex: number) {
    let segment = segments[newIndex];
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
    destroy(segment.videoUuid + "/segments/" + segment.uuid)
      .then(() => removeSegmentByIndex(index))
      .then(() => setPromptingSegmentDelete(null));
  }


  if (!currentSegment) {
    return (
      <Typography>
        Nothing here yet
      </Typography>
    )
  }

  function startExport() {
    return exportsAPI.post({
      videoUuid: parentId
    }).then(() => setWatchingExport(true));
  }

  return (
    <>
      <Card>
        <LinearProgress variant="determinate" value={segmentsProgress}/>
        <CardContent>
          <PagingTitle
            segment={currentSegment}
            currentSegmentIndex={currentSegmentIndex}
            segments={segments}
            setSegmentByIndex={setSegmentByIndex}
          />
          <PitchDetails segment={currentSegment}
                        updateSegment={(p) => mutateSegmentAtIndex(currentSegmentIndex, p)}/>
          <Dictaphone item={currentSegment}/>
          <Pager currentIndex={currentSegmentIndex}
                 maxIndex={segments.length - 1}
                 setByIndex={setSegmentByIndex}/>
          <Button onClick={startExport} disabled={watchingExport}>
            {watchingExport ? (exportProgress?.progress || "Starting export")  : "Export"}
          </Button>
        </CardContent>
      </Card>
      <Box marginY={2} height='50vh' style={{overflowY: 'scroll'}}>
        <Card ref={listRef}>
          <List>
            {
              segments.map(renderRow)
            }
          </List>
        </Card>
      </Box>
      {
        editingSegment !== null &&
        <MediaSegmentEditDialog
          open={!!editingSegment}
          onClose={handleModalClose}
          onDestroy={removeCurrentSegment}
          onAdd={addSegment}
          segment={editingSegment}
          setSegment={setEditingSegment}
          videoId={editingSegment.videoUuid}
          previousSegmentEnd={segments[currentSegmentIndex - 1]?.end ?? 0}
          nextSegmentStart={segments[currentSegmentIndex + 1]?.start ?? 0}
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
    </>
  );
};