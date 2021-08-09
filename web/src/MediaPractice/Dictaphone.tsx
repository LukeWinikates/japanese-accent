import {FormControlLabel, Grid, IconButton, makeStyles, Typography} from "@material-ui/core";
import {DummyPlayer, Player} from "./Player";
import {AudioRecording, Recorder} from "./Recorder";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import SkipPreviousIcon from "@material-ui/core/SvgIcon/SvgIcon";
import React, {useState} from "react";
import {Media, Segment} from "../api";
import SkipNextIcon from '@material-ui/icons/SkipNext';

const useStyles = makeStyles(() => ({
  playerControls: {
    textAlign: 'center',
  },
}));

export declare type DictaphoneProps = {
  videoId: string
  segment: Segment
  setSegmentByIndex: (newIndex: number) => void
  segmentIndex: number
  lastSegmentIndex: number
};

export const Dictaphone = ({videoId, segment, setSegmentByIndex, segmentIndex, lastSegmentIndex}: DictaphoneProps) => {
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [currentRecording, setCurrentRecording] = useState<AudioRecording | null>(null);
  const [autoRecord, setAutoRecord] = useState<boolean>(true);
  const [autoplay, setAutoplay] = useState<boolean>(true);


  function saveRecording(recording: AudioRecording) {
    let newRecording = {...recording};
    setRecordings([...recordings, newRecording]);
    setCurrentRecording(newRecording);
  }

  function audioUrl() {
    return `/media/audio/${videoId}` + (segment ? `#t=${segment.start / 1000},${segment.end / 1000}` : "");
  }

  function pauseAll() {
    document.querySelectorAll("audio").forEach(a => a.pause());
  }

  const classes = useStyles();

  return (
    <Grid container item spacing={1}>
      <Grid container item xs={12} spacing={1}>
        <Typography variant="h6" align="left">
          {segment?.text}
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
                  duration={{startSec: segment.start, endSec: segment.end}}
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
          <IconButton disabled={segmentIndex === 0}
                      onClick={() => setSegmentByIndex(segmentIndex - 1)}>
            <SkipPreviousIcon/>
          </IconButton>
        </Grid>
        <Grid item xs={1}>
          <IconButton disabled={segmentIndex === lastSegmentIndex}
                      onClick={() => setSegmentByIndex(segmentIndex + 1)}>
            <SkipNextIcon/>
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};