import React, {useCallback, useRef, useState} from "react";
import {Segment, SuggestedSegment, Video, VideoAdvice} from "../../App/api";
import {Card, CardContent, FormControlLabel, List, Switch, Typography,} from "@mui/material";
import {Pager} from "../../Dictaphone/Pager";
import {merged} from "../YouTube/SuggestionMerger";
import {VariableSizeList} from 'react-window';
import {Editor} from "./Editor";
import {ARE_ADVICE, ARE_MUTED} from "./segment";
import {elementForLabels, sizeForSegment} from "./ListItems";
import {suggestedSegmentsDELETE} from "../../App/ApiRoutes";

type Props = {
  advice: VideoAdvice,
  video: Video,
  videoUuid: string,
  muteSuggestion: (segment: SuggestedSegment) => void,
}

export function VideoClipList({advice, videoUuid, video, muteSuggestion}: Props) {
  const [selectedSegment, setSelectedSegment] = useState<Segment | SuggestedSegment | null>(null);//advice.suggestedSegments[0]);
  const [showMuted, setShowMuted] = useState<boolean>(false);
  const toggleShowMuted = useCallback((_: any, lastState: boolean) => {
    setShowMuted(!showMuted);
    listRef.current?.resetAfterIndex(0);
  }, [showMuted]);
  const listRef = useRef<VariableSizeList | null>(null);

  const segmentsForTimeline = merged({
    suggestedSegments: advice.suggestedSegments,
    segments: video.segments,
  });

  const sizeFor = useCallback((index: number) => {
    const d = segmentsForTimeline[index];
    return sizeForSegment(d, showMuted);
  }, [showMuted, segmentsForTimeline]);

  const selectedSegmentIndex = advice.suggestedSegments.findIndex(s => s.uuid === selectedSegment?.uuid)



  function selectedSegmentByIndex(index: number) {
    setSelectedSegment(advice.suggestedSegments[index]);
  }

  const deleteSegment = (segment: Segment | SuggestedSegment) => {
    if (segment.labels.some(ARE_ADVICE)) {
      return suggestedSegmentsDELETE(video.videoId, segment.uuid).then(() => muteSuggestion(segment));
    }
    console.log("no delete implementation for true segments yet")
    // return videoSegmentDELETE(video.videoId, segment as Segment)
  }

  function titleFor(selectedSegment: Segment | SuggestedSegment): string {
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
                maxIndex={advice.suggestedSegments.length - 1}
                betweenElement={<div>{titleFor(selectedSegment)}</div>}
                setByIndex={selectedSegmentByIndex}/>
              <Editor
                segment={selectedSegment}
                setSegment={setSelectedSegment}
                parentUuid={selectedSegment.uuid}
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