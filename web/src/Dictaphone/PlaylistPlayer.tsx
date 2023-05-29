import {duration, Export, Segment} from "../api/types";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
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
  ListItemButton,
  ListItemSecondaryAction,
  Typography
} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/material/SvgIcon";
import {Dictaphone} from "./Dictaphone";
import {MediaSegmentEditDialog} from "../Video/Segments/MediaSegmentEditDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import {PitchDetails} from "./PitchDetails";
import {PagingTitle} from "./PagingTitle";
import {Pager} from "./Pager";
import {useInterval} from "../App/useInterval";
import {useBackendAPI} from "../App/useBackendAPI";

type PlaylistPlayerProps = { segments: Segment[], onSegmentsChange: (segments: Segment[]) => void, parentId: string };

export const PlaylistPlayer = ({segments, onSegmentsChange, parentId}: PlaylistPlayerProps) => {
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [promptingSegmentDelete, setPromptingSegmentDelete] = useState<{ segment: Segment, index: number } | null>(null);
  const [currentSegment, setCurrentSegment] = useState<Segment | null>(segments[0]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [watchingExport, setWatchingExport] = useState(false);
  const [exportProgress, setExportProgress] = useState<Export | null>(null);
  let segmentsProgress = (currentSegmentIndex + 1) / segments.length * 100;
  const api = useBackendAPI();

  function pauseAll() {
    document.querySelectorAll("audio").forEach(a => a.pause());
  }

  useEffect(() => {
    setCurrentSegment(segments[0])
    setCurrentSegmentIndex(0);
  }, [parentId, segments]);

  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    listRef.current?.querySelectorAll(`li`)[currentSegmentIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [currentSegmentIndex])

  useInterval(() => {
    api.exports.GET(parentId)
      .then((r) => {
        setExportProgress(r.data);
        r.data.done && setWatchingExport(false)
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
      <ListItemButton key={index}
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
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => promptToDelete(segment, index)}
            size="large">
            <DeleteIcon/>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItemButton>
    );
  };

  function destroySegment(segment: Segment, index: number) {
    api.videos.clips.DELETE(segment.videoUuid, segment.uuid)
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
    return api.exports.POST(parentId).then(() => setWatchingExport(true));
  }

  if (!currentSegment) {
    return <>no current segment</>
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
            {watchingExport ? (exportProgress?.progress || "Starting export") : "Export"}
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
          previousSegmentEnd={segments[currentSegmentIndex - 1]?.endMS ?? 0}
          nextSegmentStart={segments[currentSegmentIndex + 1]?.startMS ?? 0}
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