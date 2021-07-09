import React, {useEffect, useState} from 'react';
import useFetch from "use-http";

import {duration, Link, Segment} from "./api";
import {Button, FormControlLabel, Grid, IconButton, ListItem, makeStyles, Typography} from "@material-ui/core";
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import {AudioRecording, Recorder} from "./Recorder";
import EditIcon from '@material-ui/icons/Edit';
import {FixedSizeList, ListChildComponentProps} from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import ListItemText from "@material-ui/core/ListItemText";
import {MediaSegmentEditDialog} from "./MediaSegmentEditDialog";
import {DummyPlayer, Player} from "./Player";
import Checkbox from "@material-ui/core/Checkbox";


const useStyles = makeStyles((theme) => ({
  playerControls: {
    textAlign: 'center',
  },
}));

export const LinkedVideo = ({link}: { link: Link }) => {
  const classes = useStyles();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [currentSegment, setCurrentSegment] = useState<Segment | null>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [currentRecording, setCurrentRecording] = useState<AudioRecording | null>(null);
  const [autoRecord, setAutoRecord] = useState<boolean>(true);
  const [autoplay, setAutoplay] = useState<boolean>(true);

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

  function pauseAll() {
    document.querySelectorAll("audio").forEach(a => a.pause());
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
      </ListItem>
    );
  }

  async function handleModalClose() {
    setEditingSegment(null);
    await initialize();
  }

  function setSegmentByIndex(newIndex: number) {
    let segment = segments[newIndex];
    setCurrentSegmentIndex(newIndex);
    setCurrentSegment(segment);
  }

  if (currentSegment === null) {
    return (<></>);
  }

  function saveRecording(recording: AudioRecording) {
    let newRecording = {...recording};
    setRecordings([...recordings, newRecording]);
    setCurrentRecording(newRecording);
  }

  return (
    <Grid container spacing={1}>
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
          <Grid item xs={1}>
            <Typography variant="body1">
              Native:
            </Typography>
          </Grid>
          <Grid item xs={11}>
            <Player src={audioUrl()}
                    duration={{startSec: currentSegment.start, endSec: currentSegment.end}}
                    autoplayOnChange={false}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} justify="center" alignItems="center" className={classes.playerControls}>
          <Grid item xs={1}>
            <Typography variant="body1">
              Practice:
            </Typography>
          </Grid>
          <Grid item xs={11}>
            {
              currentRecording === null ?
                <DummyPlayer/> :
                <Player src={currentRecording.blobUrl}
                        autoplayOnChange={autoplay}
                        duration="auto"/>
            }

          </Grid>
        </Grid>
        <Grid container item xs={12} className={classes.playerControls}>
          <Recorder beforeRecord={pauseAll} onNewRecording={saveRecording}/>
          <FormControlLabel
            control={<Checkbox
              checked={autoplay}
              onChange={() => setAutoplay(!autoplay)}
              color={autoplay ? "primary" : "default"}

              inputProps={{'aria-label': 'autoplay'}}
            />}
            label={"Autoplay after recording"}
          />
          <FormControlLabel
            control={<Checkbox
              checked={autoRecord}
              onChange={() => setAutoRecord(!autoRecord)}
              color={autoplay ? "primary" : "default"}

              inputProps={{'aria-label': 'autoRecord after playing native recording'}}
            />}
            label={"Autorecord after playing native recrording"}
          />
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