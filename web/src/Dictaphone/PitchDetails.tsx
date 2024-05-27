import {Clip} from "../api/types";
import React, {useCallback, useState} from "react";
import {Button, Grid} from "@mui/material";
import {RawMoraSVG, SkeletonMoraSVG} from "../VocabularyPractice/MoraSVG";
import {SuzukiButton} from "../VocabularyPractice/SuzukiButton";
import AddWordDialog from "../Pages/WordList/AddWordDialog";
import {useBackendAPI} from "../App/useBackendAPI";

type PitchDetailsProps = {
  clip: Clip,
  updateClip: (clip: Clip) => void
};

export const PitchDetails = ({clip, updateClip}: PitchDetailsProps) => {
  const [isAddingWord, setIsAddingWord] = useState(false);
  const api = useBackendAPI();

  const fetchOJADPronunciation = useCallback(() => {
    api.videos.clips.pitch.POST(clip.uuid)
      .then(({data: p}) => updateClip({
        ...clip,
        pitch: p
      }))
  }, [api.videos.clips.pitch, updateClip, clip]);

  const onClose = useCallback(() => setIsAddingWord(false), [setIsAddingWord]);
  const onAddWord = useCallback(() => setIsAddingWord(true), [setIsAddingWord]);

  return (
    <Grid container item xs={12} spacing={2}>
      {
        clip.pitch ?
          <RawMoraSVG morae={clip.pitch.morae.split(' ')} pattern={clip.pitch.pattern}/> :
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
          <SuzukiButton text="Open in Suzuki-kun" items={[clip.text]}/>
        </Grid>
      </Grid>
      {isAddingWord && <AddWordDialog onClose={onClose} videoId={clip.videoUuid}/>}
    </Grid>
  );
}
