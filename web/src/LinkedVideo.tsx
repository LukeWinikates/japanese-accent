import React, {useEffect, useRef, useState} from 'react';
import useFetch from "use-http";

import {duration, Link, Segment} from "./api";
import {Button, ButtonGroup, Grid, LinearProgress, ListItem, Typography} from "@material-ui/core";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {Recorder} from "./Recorder";
import EditIcon from '@material-ui/icons/Edit';
import {FixedSizeList, ListChildComponentProps} from 'react-window';
import {Pagination} from '@material-ui/lab';
import AutoSizer from "react-virtualized-auto-sizer";
import PauseIcon from '@material-ui/icons/Pause';
import ListItemText from "@material-ui/core/ListItemText";
import {MediaSegmentsEditDialog} from "./MediaSegmentsEditDialog";

export const LinkedVideo = ({link}: { link: Link }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<Segment | null>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [playingSegment, setPlayingSegment] = useState(false);
  const [progress, setProgress] = useState(0);

  const {get, response} = useFetch('/media/audio/' + link.videoId + "/segments");
  const handleSegmentChange = (event: any, segmentIndex: number) => {
    audioRef.current?.pause();
    setCurrentSegmentIndex(segmentIndex);
    setCurrentSegment(segments[segmentIndex]);
    audioRef.current?.play();
  };


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
    console.log(audioRef.current?.currentTime);
    console.log(currentSegment?.end);
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
                  // play();
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
    console.log("ended");
    if (currentSegment === null) {
      return;
    }
    setPlayingSegment(false);
    audioRef.current?.fastSeek(currentSegment.start / 1000);
  };


  function handleModalClose() {
    setModalOpen(false);
  }

  const calculateProgress = () => {
    if (audioRef.current === null || currentSegment === null) {
      return 0;
    }
    const current = audioRef.current.currentTime - (currentSegment.start / 1000);
    const total = (currentSegment.end / 1000) - (currentSegment.start / 1000);
    let progress = (current / total) * 100;
    console.log("progress:", progress);
    return progress;
  };

  return (
    <Grid container spacing={1}>
      <Grid container item xs={6} spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h6">
            {currentSegmentIndex + 1}: {currentSegment?.text}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <audio ref={audioRef} src={audioUrl()} controls={false} onEnded={ended} onTimeUpdate={timeUpdate}/>
          <Typography variant="h6">
            Native Recording
          </Typography>
          <ButtonGroup>
            <Button onClick={play} color="primary" variant="contained"
                    startIcon={<PlayArrowIcon/>}>
              Play
            </Button>
            <Button onClick={pause} color="primary" variant="contained"
                    startIcon={<PauseIcon/>}>
              Pause
            </Button>
          </ButtonGroup>
          <LinearProgress variant="determinate" value={progress}/>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            Practice
          </Typography>
          <Recorder beforeRecord={pause}/>
        </Grid>
        <Grid item xs={12}>
          <Pagination count={segments.length} page={currentSegmentIndex} siblingCount={2} size="small"
                      onChange={handleSegmentChange}/>
        </Grid>
      </Grid>
      <Grid container item xs={6}>
        <Grid item xs={9}>
          <Typography variant="h5">
            Native Recordings
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Button endIcon={<EditIcon/>} onClick={() => setModalOpen(true)}>
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
      <MediaSegmentsEditDialog
        open={modalOpen}
        onClose={handleModalClose}
        segments={segments}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        />
    </Grid>
  );
};