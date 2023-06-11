import {Clip, durationSeconds, Export} from "../api/types";
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
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
  ListItemSecondaryAction
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

type RowProps = {
  segment: Clip,
  index: number,
  isCurrent: boolean,
  onChangeSegment: (segment: Clip, index: number) => void,
  onEdit: (segment: Clip) => void,
  onDelete: (segment: Clip, index: number) => void,

}
const Row = ({segment, index, onChangeSegment, isCurrent, onEdit, onDelete}: RowProps) => {
  const pauseAndChangeCurrentSegment = useCallback(() => {
    onChangeSegment(segment, index);
  }, [onChangeSegment, segment, index]);

  const onClickEdit = useCallback(() => {
    onEdit(segment)
  }, [onEdit, segment]);

  const onClickDelete = useCallback(() => {
    onDelete(segment, index)
  }, [onDelete, segment, index]);

  return (
    <ListItemButton key={index}
                    selected={isCurrent}
                    alignItems="flex-start"
                    onClick={pauseAndChangeCurrentSegment}
    >
      <ListItemText
        primaryTypographyProps={{noWrap: true, variant: "body2"}}
        primary={segment.text}
        secondary={Math.round(durationSeconds(segment)) + "s"}
      >
      </ListItemText>
      <ListItemSecondaryAction>
        <Button endIcon={<EditIcon/>} onClick={onClickEdit}>
          Edit
        </Button>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={onClickDelete}
          size="large">
          <DeleteIcon/>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItemButton>
  );
}

type PlaylistPlayerProps = { segments: Clip[], onSegmentsChange: (segments: Clip[]) => void, parentId: string };

export const PlaylistPlayer = ({segments, onSegmentsChange, parentId}: PlaylistPlayerProps) => {
  const [editingSegment, setEditingSegment] = useState<Clip | null>(null);
  const [promptingSegmentDelete, setPromptingSegmentDelete] = useState<{ segment: Clip, index: number } | null>(null);
  const [currentSegment, setCurrentSegment] = useState<Clip | null>(segments[0]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [watchingExport, setWatchingExport] = useState(false);
  const [exportProgress, setExportProgress] = useState<Export | null>(null);
  let segmentsProgress = (currentSegmentIndex + 1) / segments.length * 100;
  const api = useBackendAPI();

  const pauseAll = useCallback(() => {
    document.querySelectorAll("audio").forEach(a => a.pause());
  }, []);

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

  const setSegmentByIndex = useCallback((newIndex: number) => {
    let segment = segments[newIndex];
    setCurrentSegmentIndex(newIndex);
    setCurrentSegment(segment);
  }, [segments]);

  const handleModalClose = useCallback(async () => {
    if (editingSegment === null) {
      return;
    }
    const editedSegment = editingSegment;
    let newSegments = [...segments];
    newSegments.splice(currentSegmentIndex, 1, editedSegment);
    setEditingSegment(null);
    onSegmentsChange(newSegments);
    setCurrentSegment(editedSegment);
  }, [currentSegmentIndex, editingSegment, onSegmentsChange, segments]);

  const removeSegmentByIndex = useCallback((index: number) => {
      let newSegments = [...segments];
      newSegments.splice(index, 1);
      onSegmentsChange(newSegments);
      if (currentSegmentIndex === index) {
        setSegmentByIndex(currentSegmentIndex - 1);
      }
    }
    , [currentSegmentIndex, onSegmentsChange, segments, setSegmentByIndex]);

  const removeCurrentSegment = useCallback(() => {
    setEditingSegment(null);
    removeSegmentByIndex(currentSegmentIndex);
  }, [currentSegmentIndex, removeSegmentByIndex]);

  const mutateSegmentAtIndex = useCallback((index: number, newValue: Clip) => {
    const newSegments = [...segments];
    newSegments[index] = newValue;
    onSegmentsChange(newSegments);
    if (index === currentSegmentIndex) {
      setCurrentSegment(newValue);
    }
  }, [currentSegmentIndex, onSegmentsChange, segments]);

  const addSegment = useCallback((newSegment: Clip) => {
    let newSegments = [...segments];
    newSegments.splice(currentSegmentIndex + 1, 0, newSegment)
    onSegmentsChange(newSegments);
  }, [currentSegmentIndex, onSegmentsChange, segments]);

  const promptToDelete = useCallback((segment: Clip, index: number) => {
    setPromptingSegmentDelete({segment, index});
  }, [setPromptingSegmentDelete]);

  const onPauseAndChangeSegment = useCallback((segment: Clip, index: number) => {
    pauseAll();
    setCurrentSegment(segment);
    setCurrentSegmentIndex(index);
  }, [setCurrentSegment, setCurrentSegmentIndex, pauseAll])

  const destroySegment = useCallback((segment: Clip, index: number) => {
    api.videos.clips.DELETE(segment.videoUuid, segment.uuid)
      .then(() => removeSegmentByIndex(index))
      .then(() => setPromptingSegmentDelete(null));
  }, [api.videos.clips, removeSegmentByIndex]);

  const startExport = useCallback(() => {
    return api.exports.POST(parentId).then(() => setWatchingExport(true));
  }, [api.exports, parentId]);

  const onCancelDeletePrompt = useCallback(() => setPromptingSegmentDelete(null), []);
  const onDestroySegment = useCallback(() => {
    return promptingSegmentDelete && destroySegment(promptingSegmentDelete.segment, promptingSegmentDelete.index);
  }, [promptingSegmentDelete, destroySegment]);

  const onUpdateSegment = useCallback((s: Clip) => {
    mutateSegmentAtIndex(currentSegmentIndex, s);
  }, [currentSegmentIndex, mutateSegmentAtIndex]);

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
                        updateSegment={onUpdateSegment}/>
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
              segments.map((segment: Clip, index: number) => {
                return <Row
                  segment={segment}
                  index={index}
                  onChangeSegment={onPauseAndChangeSegment}
                  onDelete={promptToDelete}
                  onEdit={setEditingSegment}
                  isCurrent={index === currentSegmentIndex}/>
              })
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
          onClose={onCancelDeletePrompt}
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
            <Button onClick={onCancelDeletePrompt} color="primary">
              Keep
            </Button>
            <Button onClick={onDestroySegment}
                    color="primary" autoFocus>
              Destroy
            </Button>
          </DialogActions>
        </Dialog>
      }
    </>
  );
};