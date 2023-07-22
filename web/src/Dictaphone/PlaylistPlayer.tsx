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
import {ClipEditorDialog} from "../Video/Clips/ClipEditorDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import {PitchDetails} from "./PitchDetails";
import {PagingTitle} from "./PagingTitle";
import {Pager} from "./Pager";
import {useInterval} from "../App/useInterval";
import {useBackendAPI} from "../App/useBackendAPI";

type RowProps = {
  clip: Clip,
  index: number,
  isCurrent: boolean,
  onChangeClip: (clip: Clip, index: number) => void,
  onEdit: (clip: Clip) => void,
  onDelete: (clip: Clip, index: number) => void,

}
const Row = ({clip, index, onChangeClip, isCurrent, onEdit, onDelete}: RowProps) => {
  const pauseAndChangeCurrentClip = useCallback(() => {
    onChangeClip(clip, index);
  }, [onChangeClip, clip, index]);

  const onClickEdit = useCallback(() => {
    onEdit(clip)
  }, [onEdit, clip]);

  const onClickDelete = useCallback(() => {
    onDelete(clip, index)
  }, [onDelete, clip, index]);

  return (
    <ListItemButton key={index}
                    selected={isCurrent}
                    alignItems="flex-start"
                    onClick={pauseAndChangeCurrentClip}
    >
      <ListItemText
        primaryTypographyProps={{noWrap: true, variant: "body2"}}
        primary={clip.text}
        secondary={Math.round(durationSeconds(clip)) + "s"}
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

type PlaylistPlayerProps = { clips: Clip[], onClipsChange: (clips: Clip[]) => void, parentId: string };

export const PlaylistPlayer = ({clips, onClipsChange, parentId}: PlaylistPlayerProps) => {
  const [editingClip, setEditingClip] = useState<Clip | null>(null);
  const [promptingClipDeletion, setPromptingClipDeletion] = useState<{ clip: Clip, index: number } | null>(null);
  const [currentClip, setCurrentClip] = useState<Clip | null>(clips[0]);
  const [currentClipIndex, setCurrentClipIndex] = useState<number>(0);
  const [watchingExport, setWatchingExport] = useState(false);
  const [exportProgress, setExportProgress] = useState<Export | null>(null);
  let clipProgress = (currentClipIndex + 1) / clips.length * 100;
  const api = useBackendAPI();

  const pauseAll = useCallback(() => {
    document.querySelectorAll("audio").forEach(a => a.pause());
  }, []);

  useEffect(() => {
    setCurrentClip(clips[0])
    setCurrentClipIndex(0);
  }, [parentId, clips]);

  const listRef = useRef<HTMLDivElement>(null!);

  useLayoutEffect(() => {
    listRef.current?.querySelectorAll(`li`)[currentClipIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [currentClipIndex])

  useInterval(() => {
    api.exports.GET(parentId)
      .then((r) => {
        setExportProgress(r.data);
        r.data.done && setWatchingExport(false)
      });
  }, watchingExport ? 200 : null);

  const setClipByIndex = useCallback((newIndex: number) => {
    let clip = clips[newIndex];
    setCurrentClipIndex(newIndex);
    setCurrentClip(clip);
  }, [clips]);

  const handleModalClose = useCallback(async () => {
    if (editingClip === null) {
      return;
    }
    const editedClip = editingClip;
    let newClips = [...clips];
    newClips.splice(currentClipIndex, 1, editedClip);
    setEditingClip(null);
    onClipsChange(newClips);
    setCurrentClip(editedClip);
  }, [currentClipIndex, editingClip, onClipsChange, clips]);

  const removeClipByIndex = useCallback((index: number) => {
      let newClips = [...clips];
      newClips.splice(index, 1);
      onClipsChange(newClips);
      if (currentClipIndex === index) {
        setClipByIndex(currentClipIndex - 1);
      }
    }
    , [currentClipIndex, onClipsChange, clips, setClipByIndex]);

  const removeCurrentClip = useCallback(() => {
    setEditingClip(null);
    removeClipByIndex(currentClipIndex);
  }, [currentClipIndex, removeClipByIndex]);

  const mutateClipAtIndex = useCallback((index: number, newValue: Clip) => {
    const newClips = [...clips];
    newClips[index] = newValue;
    onClipsChange(newClips);
    if (index === currentClipIndex) {
      setCurrentClip(newValue);
    }
  }, [currentClipIndex, onClipsChange, clips]);

  const addClip = useCallback((newClip: Clip) => {
    let newClips = [...clips];
    newClips.splice(currentClipIndex + 1, 0, newClip)
    onClipsChange(newClips);
  }, [currentClipIndex, onClipsChange, clips]);

  const promptToDelete = useCallback((clip: Clip, index: number) => {
    setPromptingClipDeletion({clip: clip, index});
  }, [setPromptingClipDeletion]);

  const onPauseAndSetNewCurrentClip = useCallback((clip: Clip, index: number) => {
    pauseAll();
    setCurrentClip(clip);
    setCurrentClipIndex(index);
  }, [setCurrentClip, setCurrentClipIndex, pauseAll])

  const destroyClip = useCallback((clip: Clip, index: number) => {
    api.videos.clips.DELETE(clip.videoUuid, clip.uuid)
      .then(() => removeClipByIndex(index))
      .then(() => setPromptingClipDeletion(null));
  }, [api.videos.clips, removeClipByIndex]);

  const startExport = useCallback(() => {
    return api.exports.POST(parentId).then(() => setWatchingExport(true));
  }, [api.exports, parentId]);

  const onCancelDeletePrompt = useCallback(() => setPromptingClipDeletion(null), []);
  const onDestroyClip = useCallback(() => {
    return promptingClipDeletion && destroyClip(promptingClipDeletion.clip, promptingClipDeletion.index);
  }, [promptingClipDeletion, destroyClip]);

  const onUpdateClip = useCallback((s: Clip) => {
    mutateClipAtIndex(currentClipIndex, s);
  }, [currentClipIndex, mutateClipAtIndex]);

  if (!currentClip) {
    return <>no current clip</>
  }

  return (
    <>
      <Card>
        <LinearProgress variant="determinate" value={clipProgress}/>
        <CardContent>
          <PagingTitle
            clip={currentClip}
            currentClipIndex={currentClipIndex}
            clips={clips}
            setClipByIndex={setClipByIndex}
          />
          <PitchDetails clip={currentClip}
                        updateClip={onUpdateClip}/>
          <Dictaphone item={currentClip}/>
          <Pager currentIndex={currentClipIndex}
                 maxIndex={clips.length - 1}
                 setByIndex={setClipByIndex}/>
          <Button onClick={startExport} disabled={watchingExport}>
            {watchingExport ? (exportProgress?.progress || "Starting export") : "Export"}
          </Button>
        </CardContent>
      </Card>
      <Box marginY={2} height='50vh' style={{overflowY: 'scroll'}}>
        <Card ref={listRef}>
          <List>
            {
              clips.map((clip: Clip, index: number) => {
                return <Row
                  clip={clip}
                  index={index}
                  onChangeClip={onPauseAndSetNewCurrentClip}
                  onDelete={promptToDelete}
                  onEdit={setEditingClip}
                  isCurrent={index === currentClipIndex}/>
              })
            }
          </List>
        </Card>
      </Box>
      {
        editingClip !== null &&
        <ClipEditorDialog
          open={!!editingClip}
          onClose={handleModalClose}
          onDestroy={removeCurrentClip}
          onAdd={addClip}
          clip={editingClip}
          setClip={setEditingClip}
          videoId={editingClip.videoUuid}
          previousClipEndMS={clips[currentClipIndex - 1]?.endMS ?? 0}
          previousClipStartMS={clips[currentClipIndex + 1]?.startMS ?? 0}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        />
      }

      {
        promptingClipDeletion !== null &&
        <Dialog
          open={true}
          onClose={onCancelDeletePrompt}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete this clip?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {promptingClipDeletion.clip.text}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancelDeletePrompt} color="primary">
              Keep
            </Button>
            <Button onClick={onDestroyClip}
                    color="primary" autoFocus>
              Destroy
            </Button>
          </DialogActions>
        </Dialog>
      }
    </>
  );
};