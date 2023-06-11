import {Clip} from "../api/types";
import React, {useCallback, useState} from "react";
import {Button, Grid} from "@mui/material";
import {RawMoraSVG, SkeletonMoraSVG} from "../VocabularyPractice/MoraSVG";
import {SuzukiButton} from "../VocabularyPractice/SuzukiButton";
import AddWordDialog from "../Pages/WordList/AddWordDialog";
import {useBackendAPI} from "../App/useBackendAPI";

type PitchDetailsProps = {
  segment: Clip,
  updateSegment: (segment: Clip) => void
};

export const PitchDetails = ({segment, updateSegment}: PitchDetailsProps) => {
  const [isAddingWord, setIsAddingWord] = useState(false);
  const api = useBackendAPI();

  const fetchOJADPronunciation = useCallback(() => {
    api.videos.clips.pitch.POST(segment.uuid)
      .then(({data: p}) => updateSegment({
        ...segment,
        pitch: p
      }))
  }, [api.videos.clips.pitch, updateSegment, segment]);

  let onClose = useCallback(() => setIsAddingWord(false), [setIsAddingWord]);
  let onAddWord = useCallback(() => setIsAddingWord(true), [setIsAddingWord]);

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
          <Button onClick={onAddWord}>
            Add Word
          </Button>
        </Grid>
        <Grid item xs={4}>
          <SuzukiButton text="Open in Suzuki-kun" items={[segment.text]}/>
        </Grid>
      </Grid>
      {isAddingWord && <AddWordDialog onClose={onClose} videoId={segment.videoUuid}/>}
    </Grid>
  );
}
