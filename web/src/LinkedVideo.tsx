import React, {MouseEventHandler, ReactEventHandler, useEffect, useRef, useState} from 'react';
import useFetch from "use-http";

import {duration, Link, Segment} from "./api";
import {Button, Grid, IconButton, LinearProgress, ListItem, makeStyles, Typography} from "@material-ui/core";
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import RewindIcon from '@material-ui/icons/ArrowLeft';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {Recorder} from "./Recorder";
import EditIcon from '@material-ui/icons/Edit';
import {FixedSizeList, ListChildComponentProps} from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import PauseIcon from '@material-ui/icons/Pause';
import ListItemText from "@material-ui/core/ListItemText";
import {MediaSegmentEditDialog} from "./MediaSegmentEditDialog";
import {WrappedLineVisualization} from "./WrappedLineVisualization";


const useStyles = makeStyles((theme) => ({
  playerControls: {
    textAlign: 'center',
  },
}));

export const LinkedVideo = ({link}: { link: Link }) => {
  const classes = useStyles();

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [currentSegment, setCurrentSegment] = useState<Segment | null>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [playingSegment, setPlayingSegment] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastIndex = segments.length - 1;

  const {get, response} = useFetch<Segment[]>(
    '/media/audio/' + link.videoId + "/segments");

  async function initialize() {
    const initialCategory = await get('');
    if (response.ok) setSegments(initialCategory)
  }

  useEffect(() => {
    initialize().then(() => {
        setCurrentSegment(segments[0]);
        setCurrentSegmentIndex(0);
      }
    );
  }, [link.videoId]);

  function audioUrl() {
    return `/media/audio/${link.videoId}` + (currentSegment ? `#t=${currentSegment.start / 1000},${currentSegment.end / 1000}` : "");
  }

  function timeUpdate() {
    // console.log(audioRef.current?.currentTime);
    // console.log(currentSegment?.end);
    // console.log(parseTime(currentSegment?.end || ""));
    setProgress(calculateProgress());
    if (currentSegment
      && audioRef.current
      && audioRef.current.currentTime >= currentSegment.end / 1000) {
      audioRef.current?.pause();
      setPlayingSegment(false);
    }
  }

  function renderRow(props: ListChildComponentProps) {
    const {index, style} = props;
    if (!segments.length) return (<></>);
    const segment = segments[index];

    return (

      <ListItem style={style} key={index}
                selected={currentSegmentIndex === index}
                alignItems="flex-start"
                onClick={() => {
                  pause();
                  setCurrentSegment(segment);
                  setCurrentSegmentIndex(index);
                }}
      >
        <ListItemText
          primaryTypographyProps={{noWrap: true}}
          primary={segment.text}
          secondary={Math.round(duration(segment)) + "s"}
        >
          {/*<Typography component="span" variant="caption" noWrap={true}>*/}
          {/*  {segment.text}*/}
          {/*</Typography>*/}
        </ListItemText>
        {/*<ListItemSecondaryAction>*/}
        {/*  <IconButton onClick={() => {*/}
        {/*    pause();*/}
        {/*    setCurrentSegment(segment);*/}
        {/*    setCurrentSegmentIndex(index);*/}
        {/*    play();*/}
        {/*  }}>*/}
        {/*    <PlayArrowIcon/>*/}
        {/*  </IconButton>*/}
        {/*</ListItemSecondaryAction>*/}
      </ListItem>
    );
  }


  const toggle = () => {
    if (!playingSegment) {
      play();
    } else {
      pause();
    }
  };


  const play = () => {
    setPlayingSegment(true);
    audioRef.current?.play();
  };

  const pause = () => {
    setPlayingSegment(false);
    audioRef.current?.pause();
  };

  const ended = () => {
    if (currentSegment === null) {
      return;
    }
    setPlayingSegment(false);
    audioRef.current?.fastSeek(currentSegment.start / 1000);
  };


  async function handleModalClose() {
    setEditingSegment(null);
    await initialize();
  }

  const calculateProgress = () => {
    if (audioRef.current === null || currentSegment === null) {
      return 0;
    }
    const current = audioRef.current.currentTime - (currentSegment.start / 1000);
    const total = (currentSegment.end / 1000) - (currentSegment.start / 1000);
    let progress = (current / total) * 100;
    return progress;
  };

  const PlayPauseIcon = playingSegment ? PauseIcon : PlayArrowIcon;

  function rewindStart() {
    if (audioRef.current !== null && currentSegment !== null) {
      audioRef.current.currentTime = (currentSegment?.start / 1000);
    }
  }

  const handleProgressClick = (event: any) => {
    console.log(event.clientX, event.clientY);
    if (progressRef.current !== null &&
        audioRef.current !== null && currentSegment !== null) {
      const {x, width} = progressRef.current.getBoundingClientRect();
      const pct = (event.clientX - x) / width;
      const total = (currentSegment.end / 1000) - (currentSegment.start / 1000);
      const offset =  pct * total;
      audioRef.current.currentTime = (currentSegment?.start / 1000) + offset;

    }

    // console.log(event.offsetX, event.offsetY);
  };

  return (
    <Grid container spacing={1}>
      {/*<Grid container item xs={12}>*/}
        {/*<WrappedLineVisualization segments={segments} />*/}
      {/*</Grid>*/}
      <Grid container item xs={6}>
        <Grid item xs={9}>
          <Typography variant="h5">
            Native Recordings
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Button endIcon={<EditIcon/>} onClick={() => setEditingSegment(currentSegment)}>
            Edit
          </Button>
        </Grid>
        <Grid item xs={12}>
          <AutoSizer disableHeight={true}>
            {({width}) =>
              <FixedSizeList height={300} width={width} itemSize={60} itemCount={segments.length}>
                {renderRow}
              </FixedSizeList>
            }
          </AutoSizer>
        </Grid>
      </Grid>

      <Grid container item xs={6} spacing={1}>
        <Grid container item xs={12} justify="center" className={classes.playerControls}>
          <audio ref={audioRef} src={audioUrl()} controls={false} onEnded={ended} onTimeUpdate={timeUpdate}/>
          <Grid item xs={6}>
            <IconButton disabled={currentSegmentIndex === 0}
                        onClick={() => setCurrentSegmentIndex(currentSegmentIndex - 1)}>
              <SkipPreviousIcon/>
            </IconButton>
            <IconButton onClick={() => rewindStart()}>
              <RewindIcon/>
            </IconButton>
            <IconButton onClick={toggle} color="primary">
              <PlayPauseIcon fontSize="large"/>
            </IconButton>

            <IconButton disabled={currentSegmentIndex === lastIndex}
                        onClick={() => setCurrentSegmentIndex(currentSegmentIndex + 1)}>
              <SkipNextIcon/>
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress ref={progressRef} onClick={handleProgressClick} variant="determinate" value={progress}/>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            Practice
          </Typography>
          <Recorder beforeRecord={pause}/>
        </Grid>
      </Grid>

      {
        editingSegment !== null ?
          <MediaSegmentEditDialog
            open={!!editingSegment}
            onClose={handleModalClose}
            segment={editingSegment}
            setSegment={setEditingSegment}
            videoId={link.videoId}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          />
          : <> </>
      }
    </Grid>
  );
};