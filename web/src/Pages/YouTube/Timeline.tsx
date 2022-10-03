import React, {useEffect, useState} from "react";
import {DraftSegment, VideoAdvice, VideoDraft, Waveform as ApiWaveform} from "../../App/api";
import {Waveform} from "./Waveform";
import {Loadable} from "../../App/loadable";
import {Player} from "../../Dictaphone/Player";
import audioURL from "../../App/audioURL";
import {Checkbox, Grid, IconButton, List, ListItemButton, ListItemIcon, ListItemSecondaryAction} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import {rangeToHumanReadable} from "../../App/time";
import DeleteIcon from "@mui/icons-material/Delete";
import NotesIcon from "@mui/icons-material/Notes";
import CopyIcon from "@mui/icons-material/FileCopy";
import {Pager} from "../../Dictaphone/Pager";
import axios from "axios";

type TimelineProps = {
  advice: VideoAdvice,
  draft: VideoDraft,
  videoUuid: string,
  addSegment: (range: { startMS: number, endMS: number }) => void,
  setSegments: (segments: DraftSegment[]) => void,
}

const MILLISECONDS = 1000;

export function Timeline({advice, videoUuid, addSegment, setSegments, draft}: TimelineProps) {
  const [samplesData, setSamplesData] = useState<Loadable<ApiWaveform>>("loading");
  const [scrubberWindowRange, setScrubberWindowRange] = useState<{ startMS: number, endMS: number }>(
    {startMS: 0, endMS: 30 * MILLISECONDS}
  );
  const [playbackPositionMS, setPlaybackPositionMSMS] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<DraftSegment | null>(null);

  const selectedSegmentIndex = advice.suggestedSegments.findIndex(s => s.uuid === selectedSegment?.uuid)

  useEffect(() => {
    axios.get<ApiWaveform>('/api/videos/' + videoUuid + '/waveform')
      .then(r => setSamplesData({data: r.data}))
  }, [videoUuid, setSamplesData])

  useEffect(() => {
    setPlaybackPositionMSMS(selectedSegment?.startMS || 0)
  }, [selectedSegment])

  function selectedSegmentByIndex(index: number) {
    setSelectedSegment(advice.suggestedSegments[index]);
  }

  return (
    <div>
      <div>
        <div id="waveform"/>
        <div style={{width: "100%"}}>
          {samplesData !== 'loading' &&
            <Waveform samples={samplesData.data.samples}
                      sampleRate={samplesData.data.sampleRate}
                      scrubberWindowRange={scrubberWindowRange}
                      setScrubberWindowRange={setScrubberWindowRange}
                      setSegments={setSegments}
                      playerPositionMS={playbackPositionMS}
                      timings={advice.timings}
                      candidateSegments={advice.suggestedSegments}
                      setSelectedSegment={setSelectedSegment}
                      selectedSegment={selectedSegment}
                      addSegment={addSegment}
            />}
        </div>
        startSec = {(selectedSegment?.startMS || 0) / 1000} ,
        endSec = {(selectedSegment?.endMS || 0) / 1000} ,
        playbackPosition = {(playbackPositionMS || 0) / 1000} ,
        <Player src={!!selectedSegment ? audioURL({
          videoUuid,
          startMS: selectedSegment.startMS,
          endMS: selectedSegment.endMS
        }) : `/media/audio/${videoUuid}`}
                duration={!!selectedSegment ? {
                  startSec: selectedSegment.startMS / 1000,
                  endSec: selectedSegment.endMS / 1000
                } : "auto"}
                playing={isPlaying}
                onPlayerStateChanged={setIsPlaying}
                onPositionChange={setPlaybackPositionMSMS}
        />
      </div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Pager
            currentIndex={selectedSegmentIndex}
            maxIndex={advice.suggestedSegments.length - 1}
            setByIndex={selectedSegmentByIndex}/>
          <List>
            {
              advice.suggestedSegments.map((s, i) => {
                const labelId = `checkbox-list-label-${i}`;

                return (
                  <ListItemButton key={s.uuid} selected={s.uuid === selectedSegment?.uuid}
                                  onClick={() => setSelectedSegment(s)}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={false}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{'aria-labelledby': labelId}}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${i + 1}: ${rangeToHumanReadable(s.startMS, s.endMS)}`}
                      secondary={s.text}
                    >
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" size="large">
                        <DeleteIcon/>
                      </IconButton>
                      <IconButton edge="end" aria-label="edit" size="large">
                        <NotesIcon/>
                      </IconButton>
                      <IconButton edge="end" aria-label="copy" size="large">
                        <CopyIcon/>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItemButton>
                );
              })
            }
          </List>
        </Grid>
      </Grid>
    </div>
  );

}