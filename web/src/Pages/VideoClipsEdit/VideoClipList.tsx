import React, {useCallback, useRef, useState} from "react";
import {BasicClip, Clip, Video, VideoAdvice} from "../../api/types";
import {Card, CardContent, FormControlLabel, List, Switch, Typography,} from "@mui/material";
import {Pager} from "../../Dictaphone/Pager";
import {merged} from "../YouTube/SuggestionMerger";
import {VariableSizeList} from 'react-window';
import {Editor} from "./Editor";
import {ARE_ADVICE, ARE_MUTED} from "./segment";
import {elementForLabels, sizeForSegment} from "./ListItems";
import {useBackendAPI} from "../../App/useBackendAPI";

type Props = {
  advice: VideoAdvice,
  video: Video,
  videoUuid: string,
  muteSuggestion: (segment: BasicClip) => void,
  removeClip: (segment: BasicClip) => void,
}

export function VideoClipList({advice, videoUuid, video, muteSuggestion, removeClip}: Props) {
  const [selectedSegment, setSelectedSegment] = useState<Clip | BasicClip | null>(null);//advice.suggestedSegments[0]);
  const [showMuted, setShowMuted] = useState<boolean>(false);
  const api = useBackendAPI();

  const toggleShowMuted = useCallback(() => {
    setShowMuted(!showMuted);
    listRef.current?.resetAfterIndex(0);
  }, [showMuted]);
  const listRef = useRef<VariableSizeList | null>(null);

  const segmentsForTimeline = merged({
    suggestedSegments: advice.suggestedClips,
    segments: video.clips,
  });

  const sizeFor = useCallback((index: number) => {
    const d = segmentsForTimeline[index];
    return sizeForSegment(d, showMuted);
  }, [showMuted, segmentsForTimeline]);

  const selectedSegmentIndex = advice.suggestedClips.findIndex(s => s.uuid === selectedSegment?.uuid)

  const selectedSegmentByIndex = useCallback((index: number) => {
    setSelectedSegment(advice.suggestedClips[index]);
  }, [advice.suggestedClips, setSelectedSegment]);

  const deleteSegment = useCallback((segment: Clip | BasicClip) => {
    if (segment.labels.some(ARE_ADVICE)) {
      return api.videos.advice.suggestedClips.DELETE(video.videoId, segment.uuid)
        .then(() => muteSuggestion(segment));
    }
    return api.videos.clips.DELETE(video.videoId, segment.uuid)
      .then(() => removeClip(segment));
    // return videoSegmentDELETE(video.videoId, segment as Segment)
  }, [api.videos.clips, api.videos.advice.suggestedClips, video.videoId, muteSuggestion, removeClip]);

  function titleFor(selectedSegment: Clip | BasicClip): string {
    const {labels} = selectedSegment;
    if (!labels) {
      return "???"
    }

    if (labels.some(ARE_MUTED)) {
      return "Muted Segment";
    }

    if (labels.some(ARE_ADVICE)) {
      return "Suggested Clip";
    }
    return "Saved Clip";
  }

  return (
    <div>
      {selectedSegment &&
        <>

          <Card>
            <CardContent>
              <Pager
                currentIndex={selectedSegmentIndex}
                maxIndex={advice.suggestedClips.length - 1}
                betweenElement={<div>{titleFor(selectedSegment)}</div>}
                setByIndex={selectedSegmentByIndex}/>
              <Editor
                segment={selectedSegment}
                setSegment={setSelectedSegment}
                videoId={videoUuid}
                onDelete={muteSuggestion}
              />
            </CardContent>
          </Card>
        </>
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
          <List>
            <VariableSizeList
              ref={listRef}
              height={800}
              estimatedItemSize={52}
              itemCount={segmentsForTimeline.length}
              itemSize={sizeFor}
              width={"100%"}
            >
              {
                ({index, style}) => {
                  let s = segmentsForTimeline[index];
                  const Element = elementForLabels(s.labels);
                  return (
                    <Element segment={s}
                             style={style}
                             index={index}
                             showMuted={showMuted}
                             setSelectedSegment={setSelectedSegment}
                             onDelete={deleteSegment}
                             selected={selectedSegment?.uuid === s.uuid}/>
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