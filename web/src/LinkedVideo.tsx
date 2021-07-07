import React, {useEffect, useRef, useState} from 'react';
import useFetch from "use-http";

import {duration, Link, Segment} from "./api";
import {Button, Grid, IconButton, LinearProgress, ListItem, makeStyles, Typography} from "@material-ui/core";
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {Recorder} from "./Recorder";
import EditIcon from '@material-ui/icons/Edit';
import {FixedSizeList, ListChildComponentProps} from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import PauseIcon from '@material-ui/icons/Pause';
import ListItemText from "@material-ui/core/ListItemText";
import {MediaSegmentEditDialog} from "./MediaSegmentEditDialog";


const useStyles = makeStyles((theme) => ({
  playerControls: {
    textAlign: 'center',
  },
}));

export const LinkedVideo = ({link}: { link: Link }) => {
  const classes = useStyles();

  const audioRef = useRef<HTMLAudioElement>(null);
  const playerProgressRef = useRef<HTMLDivElement>(null);
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
    const segmentsResponse = await get('');
    if (response.ok) {
      setSegments(segmentsResponse);
      setCurrentSegment(segmentsResponse[0]);
      setCurrentSegmentIndex(0);
      return segmentsResponse
    }
  }

  useEffect(() => {
    initialize();
  }, [link.videoId]);

  function audioUrl() {
    return `/media/audio/${link.videoId}` + (currentSegment ? `#t=${currentSegment.start / 1000},${currentSegment.end / 1000}` : "");
  }

  function timeUpdate() {
    setProgress(calculatePlayerProgress());
    if (currentSegment
      && audioRef.current
      && audioRef.current.currentTime >= currentSegment.end / 1000) {
      audioRef.current?.pause();
      setPlayingSegment(false);
    }
  }

  function renderRow(props: ListChildComponentProps) {
    const {index, style} = props;
    if (segments.length === 0) return (<></>);
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
          primaryTypographyProps={{noWrap: true, variant: "body2"}}
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

  const currentIcon = () => {
    if (playingSegment) {
      return PauseIcon;
    }

    // if (calculatePlayerProgress() >= 1) {
    //   return RestartIcon;
    // }

    return PlayArrowIcon;

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

  const calculatePlayerProgress = () => {
    if (audioRef.current === null || currentSegment === null) {
      return 0;
    }
    const current = audioRef.current.currentTime - (currentSegment.start / 1000);
    const total = (currentSegment.end / 1000) - (currentSegment.start / 1000);
    let progress = (current / total) * 100;
    return progress;
  };


  const PlayPauseIcon = currentIcon();

  function rewindStart() {
    if (audioRef.current !== null && currentSegment !== null) {
      audioRef.current.currentTime = (currentSegment?.start / 1000);
    }
  }

  const handleProgressClick = (event: any) => {
    console.log(event.clientX, event.clientY);
    if (playerProgressRef.current !== null &&
      audioRef.current !== null && currentSegment !== null) {
      const {x, width} = playerProgressRef.current.getBoundingClientRect();
      const pct = (event.clientX - x) / width;
      const total = (currentSegment.end / 1000) - (currentSegment.start / 1000);
      const offset = pct * total;
      audioRef.current.currentTime = (currentSegment?.start / 1000) + offset;

    }

    // console.log(event.offsetX, event.offsetY);
  };

  function setSegmentByIndex(newIndex: number) {
    let segment = segments[newIndex];
    setCurrentSegmentIndex(newIndex);
    setCurrentSegment(segment);
  }

  return (
    <Grid container spacing={1}>
      {/*<Grid container item xs={12}>*/}
      {/*<WrappedLineVisualization segments={segments} />*/}
      {/*</Grid>*/}
      <Grid container item xs={5}>
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

      <Grid container item xs={7} spacing={1}>
        <Grid container item xs={12} spacing={1}>
          <Typography variant="h6" align="left">
            {currentSegment?.text}
          </Typography>
        </Grid>
        <Grid container item xs={12} justify="center" alignItems="center" className={classes.playerControls}>
          <audio ref={audioRef} src={audioUrl()} controls={false} onEnded={ended} onTimeUpdate={timeUpdate}/>
          <Grid item xs={1}>
            <Typography variant="body1">
              Native:
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {/*<IconButton onClick={() => rewindStart()}>*/}
            {/*  <RewindIcon/>*/}
            {/*</IconButton>*/}
            <IconButton onClick={toggle} color="primary">
              <PlayPauseIcon fontSize="large"/>
            </IconButton>
          </Grid>
          <Grid item xs={7}>
            <LinearProgress ref={playerProgressRef} onClick={handleProgressClick} variant="determinate"
                            value={progress}/>
          </Grid>
        </Grid>
        <Grid container item xs={12} className={classes.playerControls}>
          <Recorder beforeRecord={pause}/>
        </Grid>
        <Grid container item xs={12} justify="space-between">
          <Grid item xs={1}>
            <IconButton disabled={currentSegmentIndex === 0}
                        onClick={() => setSegmentByIndex(currentSegmentIndex - 1)}>
              <SkipPreviousIcon/>
            </IconButton>
          </Grid>
          <Grid item xs={1}>
            <IconButton disabled={currentSegmentIndex === lastIndex}
                        onClick={() => setSegmentByIndex(currentSegmentIndex + 1)}>
              <SkipNextIcon/>
            </IconButton>
          </Grid>
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