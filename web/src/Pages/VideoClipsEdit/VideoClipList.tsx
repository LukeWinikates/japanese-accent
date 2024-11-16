import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {BasicClip, Clip, Video, VideoAdvice} from "../../api/types";
import {Button, Card, CardContent, FormControlLabel, List, Switch, Typography,} from "@mui/material";
import {Pager} from "../../Dictaphone/Pager";
import {merged} from "../YouTube/SuggestionMerger";
import {VariableSizeList} from 'react-window';
import {Editor} from "./Editor";
import {ARE_ADVICE, ARE_MUTED} from "./clipLabels";
import {elementForLabels, sizeForClip} from "./ListItems";
import {useBackendAPI} from "../../App/useBackendAPI";
import {relevantClips} from "../../App/relevantClips";
import {useSearchParams} from "react-router-dom";

type Props = {
  advice: VideoAdvice,
  video: Video,
  videoUuid: string,
  muteSuggestion: (clip: BasicClip) => void,
  removeClip: (clip: BasicClip) => void,
  setAdvice: (advice: VideoAdvice) => void,
}

export function VideoClipList({advice, videoUuid, video, muteSuggestion, removeClip, setAdvice}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get("selected");

  const clipsForTimeline = merged({
    suggestions: advice.suggestedClips,
    clips: video.clips,
  });

  let selectedClipIndex = clipsForTimeline.findIndex(s => s.uuid === selected)
  if (selectedClipIndex === -1) {
    selectedClipIndex = 0
  }

  const [selectedClip, setSelectedClip] = useState<BasicClip | null>(clipsForTimeline[selectedClipIndex]);

  const [showMuted, setShowMuted] = useState<boolean>(false);
  const api = useBackendAPI();

  const listRef = useRef<VariableSizeList>(null!);

  const toggleShowMuted = useCallback(() => {
    setShowMuted(!showMuted);
    listRef.current.resetAfterIndex(0);
  }, [showMuted]);

  const sizeFor = useCallback((index: number) => {
    const clip = clipsForTimeline[index];
    return sizeForClip(clip, showMuted);
  }, [showMuted, clipsForTimeline]);

  const selectedClipByIndex = useCallback((index: number) => {
    const clip = clipsForTimeline[index];
    setSelectedClip(clip);
  }, [clipsForTimeline, setSelectedClip]);

  useEffect(() => {
    setSearchParams(selectedClip ?
      {selected: selectedClip.uuid} :
      {});
  }, [selectedClip, setSearchParams])

  const onDeleteClip = useCallback((clip: Clip | BasicClip) => {
    if (clip.labels.some(ARE_ADVICE)) {
      return api.videos.advice.suggestedClips.DELETE(video.videoId, clip.uuid)
        .then(() => muteSuggestion(clip));
    }
    return api.videos.clips.DELETE(video.videoId, clip.uuid)
      .then(() => removeClip(clip));
  }, [api.videos.clips, api.videos.advice.suggestedClips, video.videoId, muteSuggestion, removeClip]);

  const onMuteAll = useCallback(() => {
    return api.videos.advice.suggestedClips.index.DELETE(videoUuid).then(() => {
      setAdvice({
        ...advice,
        suggestedClips: advice.suggestedClips.map(c => {
          return {
            ...c,
            labels: [...c.labels, "MUTED"]
          }
        })
      })
    });
  }, [videoUuid, api.videos.advice.suggestedClips.index, advice, setAdvice]);

  const textSuggestionsForClip = useMemo(() => {
    return selectedClip ? relevantClips(selectedClip.startMS, advice.textSnippets).map(c => c.content) : [];
  }, [selectedClip, advice.textSnippets])

  function titleFor(clip: Clip | BasicClip): string {
    const {labels} = clip;
    if (!labels) {
      return "???"
    }

    if (labels.some(ARE_MUTED)) {
      return "Muted Suggestion";
    }

    if (labels.some(ARE_ADVICE)) {
      return "Suggested Clip";
    }
    return "Saved Clip";
  }

  return (
    <div>
      {selectedClip &&
        <Card>
          <CardContent>
            <Pager
              currentIndex={selectedClipIndex}
              maxIndex={advice.suggestedClips.length - 1}
              betweenElement={<div>{titleFor(selectedClip)}</div>}
              setByIndex={selectedClipByIndex}/>
            <Editor
              clip={selectedClip}
              setClip={setSelectedClip}
              videoId={videoUuid}
              onDelete={muteSuggestion}
              textSuggestions={textSuggestionsForClip}
            />
          </CardContent>
        </Card>
      }
      <Card>
        <CardContent>
          <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
            Clips
          </Typography>
          <FormControlLabel
            control={<Switch
              checked={showMuted}
              onChange={toggleShowMuted}></Switch>
            }
            label="Show Muted Clips"
          />
          <Button onClick={onMuteAll}>Mute All</Button>
          <List>
            <VariableSizeList
              ref={listRef}
              height={800}
              estimatedItemSize={52}
              itemCount={clipsForTimeline.length}
              itemSize={sizeFor}
              width={"100%"}
            >
              {
                ({index, style}) => {
                  const s = clipsForTimeline[index];
                  const Element = elementForLabels(s.labels);
                  return (
                    <Element clip={s}
                             style={style}
                             index={index}
                             showMuted={showMuted}
                             setSelectedClip={setSelectedClip}
                             onDelete={onDeleteClip}
                             selected={selectedClip?.uuid === s.uuid}/>
                  );
                }
              }
            </VariableSizeList>
          </List>
        </CardContent>
      </Card>

    </div>
  );

}