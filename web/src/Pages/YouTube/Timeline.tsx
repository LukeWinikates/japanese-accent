import React, {useEffect, useState} from "react";
import {DraftLabel, DraftSegment, VideoAdvice, VideoDraft, Waveform as ApiWaveform} from "../../App/api";
import {Waveform} from "./Waveform";
import {Loadable} from "../../App/loadable";
import {Player} from "../../Dictaphone/Player";
import audioURL from "../../App/audioURL";
import {Grid, List} from "@mui/material";
import {Pager} from "../../Dictaphone/Pager";
import {merged} from "./SuggestionMerger";
import {SuggestedListItem} from "./SuggestedListItem";
import {DraftListItem} from "./DraftListItem";
import {waveformGET} from "../../App/ApiRoutes";
import {VariableSizeList} from 'react-window';
import {MutedListItem} from "./MutedListItem";

type TimelineProps = {
  advice: VideoAdvice,
  draft: VideoDraft,
  videoUuid: string,
  addDraft: (segments: DraftSegment) => void,
  muteSuggestion: (segments: DraftSegment) => void,
}

const MILLISECONDS = 1000;

export function Timeline({advice, videoUuid, draft, addDraft, muteSuggestion}: TimelineProps) {
  const [samplesData, setSamplesData] = useState<Loadable<ApiWaveform>>("loading");
  const [scrubberWindowRange, setScrubberWindowRange] = useState<{ startMS: number, endMS: number }>(
    {startMS: 0, endMS: 30 * MILLISECONDS}
  );
  const [playbackPositionMS, setPlaybackPositionMSMS] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<DraftSegment | null>(null);

  const selectedSegmentIndex = advice.suggestedSegments.findIndex(s => s.uuid === selectedSegment?.uuid)

  const segmentsForTimeline = merged({
    suggestedSegments: advice.suggestedSegments,
    draftSegments: draft.draftSegments,
  });

  useEffect(() => {
    waveformGET(videoUuid)
      .then(r => setSamplesData({data: r.data}))
  }, [videoUuid, setSamplesData])

  useEffect(() => {
    setPlaybackPositionMSMS(selectedSegment?.startMS || 0)
  }, [selectedSegment])

  function selectedSegmentByIndex(index: number) {
    setSelectedSegment(advice.suggestedSegments[index]);
  }

  function elementForLabel(label: DraftLabel[]) {
    if (label[0] === 'MUTED') {
      return MutedListItem;
    }

    if (label[0] === 'DRAFT') {
      return DraftListItem;
    }
    return SuggestedListItem;
  }

  const sizeFor = (index: number) => {
    const d = segmentsForTimeline[index];
    return d?.labels?.some(l => l === "MUTED") ? 4 : 52
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
              // setSegments={setSegments}
                      playerPositionMS={playbackPositionMS}
                      timings={advice.timings}
                      candidateSegments={advice.suggestedSegments}
                      setSelectedSegment={setSelectedSegment}
                      selectedSegment={selectedSegment}
              // addSegment={addSegment}
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
            <VariableSizeList
              height={800}
              estimatedItemSize={52}
              itemCount={segmentsForTimeline.length}
              itemSize={sizeFor}
              width={"100%"}
            >
              {
                ({index, style}) => {
                  let s = segmentsForTimeline[index];
                  const Element = elementForLabel(s.labels);
                  return (
                    <Element segment={s}
                             style={style}
                             onAddDraft={addDraft}
                             onMute={muteSuggestion}
                             videoId={videoUuid}
                             index={index}
                             setSelectedSegment={setSelectedSegment}
                             selected={selectedSegment?.uuid === s.uuid}/>
                  );
                }
              }
            </VariableSizeList>
          </List>
        </Grid>
      </Grid>
    </div>
  );

}