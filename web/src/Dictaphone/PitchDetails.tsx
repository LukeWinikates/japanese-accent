import {Pitch, Segment} from "../App/api";
import React, {useState} from "react";
import {Button, Grid} from "@mui/material";
import {RawMoraSVG, SkeletonMoraSVG} from "../VocabularyPractice/MoraSVG";
import {useServerInteractionHistory} from "../Layout/useServerInteractionHistory";
import {SuzukiButton} from "../VocabularyPractice/SuzukiButton";
import AddWordDialog from "../Pages/WordList/AddWordDialog";
import axios from "axios";


export const PitchDetails = ({
                               segment,
                               updateSegment
                             }: { segment: Segment | null, updateSegment: (segment: Segment) => void }) => {


  const {logError} = useServerInteractionHistory();
  const [isAddingWord, setIsAddingWord] = useState(false);

  function fetchOJADPronunciation() {
    if (!segment) {
      return null;
    }
    axios.post<Pitch>(`/api/segments${segment.uuid}/pitches`)
      .then(({data: p}) => updateSegment({
        ...segment,
        pitch: p
      })).catch(logError)
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
          <Button onClick={() => setIsAddingWord(true)}>
            Add Word
          </Button>
        </Grid>
        <Grid item xs={4}>
          <SuzukiButton text="Open in Suzuki-kun" items={[segment?.text]}/>
        </Grid>
      </Grid>
      {isAddingWord && <AddWordDialog onClose={() => setIsAddingWord(false)} videoId={segment.videoUuid}/>}
    </Grid>
  );
}
