import {Pitch, Segment} from "../App/api";
import React from "react";
import {Button, Grid} from "@material-ui/core";
import {RawMoraSVG, SkeletonMoraSVG} from "../VocabularyPractice/MoraSVG";
import useFetch from "use-http";
import {useServerInteractionHistory} from "../Layout/useServerInteractionHistory";
import {SuzukiButton} from "../VocabularyPractice/SuzukiButton";


export const PitchDetails = ({
                               segment,
                               updateSegment
                             }: { segment: Segment | null, updateSegment: (segment: Segment) => void }) => {
  const {post: fetchOJAD} = useFetch<Pitch>(
    '/api/segments');

  const {logError} = useServerInteractionHistory();

  function fetchOJADPronunciation() {
    if (!segment) {
      return null;
    }
    fetchOJAD(`${segment.uuid}/pitches`).then((p: Pitch) => {
      updateSegment({
        ...segment,
        pitch: p
      })
    }).catch(logError)
  }


  if (segment === null) {
    return <>Nothing to see here</>
  }

  return (
    <Grid container item xs={12} spacing={2}>
      {
        segment.pitch ?
          <RawMoraSVG morae={segment.pitch.morae.split(' ')} pattern={segment.pitch.pattern}/> :
          <SkeletonMoraSVG/>
      }
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={4}>
          <Button onClick={fetchOJADPronunciation}>
            Fetch pronunciation
          </Button>
        </Grid>
        <Grid item xs={4}>
          <SuzukiButton text="Open in Suzuki-kun" items={[segment?.text]}/>
        </Grid>
      </Grid>
    </Grid>
  );
}
