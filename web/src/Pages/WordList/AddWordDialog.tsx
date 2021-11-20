import React, {useEffect, useState} from 'react';
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
  makeStyles,
  TextField,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useFetch from "use-http";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import {RawMoraSVG} from "../../VocabularyPractice/MoraSVG";
import {Player} from "../../Dictaphone/Player";
import {Pagination, Skeleton} from "@material-ui/lab";
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import {Audio, WordAnalysis} from "../../App/api";

type AddWordDialogProps = { videoId: string, onClose: () => void };

const useStyles = makeStyles(theme => (
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
  const handlePageChange = (event: any, value: number) => {
    setCurrentIndex(value - 1)
  };

  function selectPrevious() {
    setCurrentIndex(currentIndex === 0 ?
      preview.audio.length - 1 :
      currentIndex - 1);
  }

  function selectNext() {
    setCurrentIndex(currentIndex === preview.audio.length - 1 ?
      0 :
      currentIndex + 1);
  }

  return (
    <>
      <RawMoraSVG
        morae={preview.morae.split(" ")}
        pattern={preview.pattern}/>

      <Grid container alignItems="center" spacing={1}>
        <Grid item xs={1}>
          <IconButton onClick={selectPrevious}>
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
          <IconButton onClick={selectNext}>
            <KeyboardArrowRightIcon/>
          </IconButton>
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item>
          <Pagination
            count={preview.audio.length}
            page={currentIndex + 1}
            onChange={handlePageChange}
          />
        </Grid>
      </Grid>
    </>
  );
}

function SkeletonPreview() {
  return (
    <>
      <Skeleton variant="text"/>
      <Skeleton variant="rect" width={210} height={118}/>
    </>
  );
}

const AddWordDialog = ({videoId, onClose}: AddWordDialogProps) => {
  const [word, setWord] = useState<{ text: string } | null>(null);
  const [preview, setPreview] = useState<WordAnalysis | null>(null);
  const classes = useStyles();
  const analysis = useFetch('/api/word-analysis/');
  const {post} = useFetch('/api/video-word-links');
  const {logError} = useServerInteractionHistory();

  const [analysisDebounce, setAnalysisDebounce] = useState<Date | undefined>();

  useEffect(() => {
    if (!analysisDebounce) {
      return
    }
    const timer = setTimeout(() => {
      previewWord();
    }, 2000);
    return () => clearTimeout(timer);
  }, [analysisDebounce])

  function previewWord() {
    if (!word) {
      return;
    }
    analysis.post({
      text: word.text
    }).then(result => setPreview(result));
  }

  function save() {
    if (word === null) {
      return
    }
    post({
      word: word.text,
      videoId
    }).then(onClose).catch(logError);
  }

  function handleWordChanged(e: any) {
    const text = e.target.value;
    setWord({text});
    setAnalysisDebounce(new Date());
  }

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
        <IconButton aria-label="close" onClick={onClose} className={classes.closeButton}>
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