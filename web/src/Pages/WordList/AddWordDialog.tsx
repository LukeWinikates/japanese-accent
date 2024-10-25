import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Pagination,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import {makeStyles} from 'tss-react/mui';
import CloseIcon from "@mui/icons-material/Close";
import {RawMoraSVG} from "../../VocabularyPractice/MoraSVG";
import {Player} from "../../Dictaphone/Player";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {Audio, WordAnalysis} from "../../api/types";
import {useBackendAPI} from "../../App/useBackendAPI";

type AddWordDialogProps = { videoId: string, onClose: () => void };

const useStyles = makeStyles<void>()(theme => (
  {
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }
));

function ClickableAudio({audio}: { audio: Audio }) {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <Typography color="textPrimary">
        {audio.speakerUsername}
      </Typography>
      <Typography color="textSecondary" gutterBottom={true}>

        {audio.speakerGender}
      </Typography>
      <Player
        onPlayerStateChanged={setIsPlaying}
        duration="auto"
        playing={isPlaying}
        src={audio.url}/>
    </>
  );
}

function Preview({preview}: { preview: WordAnalysis }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handlePageChange = useCallback((event: any, value: number) => {
    setCurrentIndex(value - 1)
  }, [setCurrentIndex]);

  const selectPrevious = useCallback(() => {
    setCurrentIndex(currentIndex === 0 ?
      preview.audio.length - 1 :
      currentIndex - 1);
  }, [setCurrentIndex, currentIndex, preview.audio]);

  const selectNext = useCallback(() => {
    setCurrentIndex(currentIndex === preview.audio.length - 1 ?
      0 :
      currentIndex + 1);
  }, [setCurrentIndex, currentIndex, preview.audio]);

  return <>
    <RawMoraSVG
      morae={preview.morae.split(" ")}
      pattern={preview.pattern}/>

    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={1}>
        <IconButton onClick={selectPrevious} size="large">
          <KeyboardArrowLeftIcon/>
        </IconButton>
      </Grid>
      <Grid item xs={10}>
        {
          preview.audio.length > 0 ?
            <ClickableAudio audio={preview.audio[currentIndex]}/> :
            <Typography>
              No audio for this word.
            </Typography>
        }
      </Grid>
      <Grid item xs={1}>
        <IconButton onClick={selectNext} size="large">
          <KeyboardArrowRightIcon/>
        </IconButton>
      </Grid>
    </Grid>
    <Grid container justifyContent="center">
      <Grid item>
        <Pagination
          count={preview.audio.length}
          page={currentIndex + 1}
          onChange={handlePageChange}
        />
      </Grid>
    </Grid>
  </>;
}

function SkeletonPreview() {
  return <>
    <Skeleton variant="text"/>
    <Skeleton variant="rectangular" width={210} height={118}/>
  </>;
}

const AddWordDialog = ({videoId, onClose}: AddWordDialogProps) => {
  const [word, setWord] = useState<{ text: string } | null>(null);
  const [preview, setPreview] = useState<WordAnalysis | null>(null);
  const {classes} = useStyles();
  const api = useBackendAPI();

  const [analysisDebounce, setAnalysisDebounce] = useState<Date | undefined>();
  const previewWord = useCallback(() => {
    if (!word) {
      return;
    }
    api.wordAnalysis.POST(word).then(r => setPreview(r.data));
  }, [word, setPreview, api.wordAnalysis]);

  useEffect(() => {
    if (!analysisDebounce) {
      return
    }
    const timer = setTimeout(() => {
      previewWord();
    }, 2000);
    return () => clearTimeout(timer);
  }, [analysisDebounce, previewWord])

  const save = useCallback(() => {
    if (word === null) {
      return
    }
    api.videos.wordLinks.POST({
      word: word.text,
      videoId
    }).then(onClose);
  }, [onClose, api.videos.wordLinks, word, videoId]);

  const handleWordChanged = useCallback((e: any) => {
    const text = e.target.value;
    setWord({text});
    setAnalysisDebounce(new Date());
  }, [setWord, setAnalysisDebounce]);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle id="simple-dialog-title">
        Link a vocabulary word to this video
        <IconButton
          aria-label="close"
          onClick={onClose}
          className={classes.closeButton}
          size="large">
          <CloseIcon/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Search for words, and associate them with this video.
        </DialogContentText>
        <TextField onChange={handleWordChanged} value={word?.text || ""}/>
        <Card>
          <CardContent>
            {
              preview !== null ?
                <Preview preview={preview}/> :
                <SkeletonPreview/>
            }
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={save} disabled={preview === null}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddWordDialog