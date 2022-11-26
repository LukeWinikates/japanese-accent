import React, {useEffect, useState} from "react";
import {DraftLabel, Segment, SuggestedSegment, Video, VideoAdvice} from "../../App/api";
import {Card, CardContent, List,} from "@mui/material";
import {Pager} from "../../Dictaphone/Pager";
import {merged} from "../YouTube/SuggestionMerger";
import {SuggestedListItem} from "../YouTube/SuggestedListItem";
import {DraftListItem} from "../YouTube/DraftListItem";
import {VariableSizeList} from 'react-window';
import {MutedListItem} from "../YouTube/MutedListItem";
import {Editor} from "./Editor";

const ARE_MUTED = (l: DraftLabel): boolean => {
  return l === "MUTED";
}

const ARE_DRAFT = (l: DraftLabel): boolean => {
  return l === "DRAFT";
}

type TimelineProps = {
  advice: VideoAdvice,
  video: Video,
  videoUuid: string,
  addSegment: (segments: Segment) => void,
  muteSuggestion: (segment: SuggestedSegment) => void,
}

const MILLISECONDS = 1000;

export function Timeline({advice, videoUuid, video, addSegment, muteSuggestion}: TimelineProps) {
  const [scrubberWindowRange, setScrubberWindowRange] = useState<{ startMS: number, endMS: number }>(
    {startMS: 0, endMS: 30 * MILLISECONDS}
  );
  const [playbackPositionMS, setPlaybackPositionMSMS] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | SuggestedSegment | null>(null);//advice.suggestedSegments[0]);

  const selectedSegmentIndex = advice.suggestedSegments.findIndex(s => s.uuid === selectedSegment?.uuid)

  const segmentsForTimeline = merged({
    suggestedSegments: advice.suggestedSegments,
    segments: video.segments,
  });

  useEffect(() => {
    setPlaybackPositionMSMS(selectedSegment?.startMS || 0)
  }, [selectedSegment])

  function selectedSegmentByIndex(index: number) {
    // setSelectedSegment(advice.suggestedSegments[index]);
  }

  function elementForLabels(labels: DraftLabel[]) {
    if (!labels) {
      return SuggestedListItem
    }

    if (labels.some(ARE_MUTED)) {
      return MutedListItem;
    }

    if (labels.some(ARE_DRAFT)) {
      return DraftListItem;
    }
    return SuggestedListItem;
  }

  const sizeFor = (index: number) => {
    const d = segmentsForTimeline[index];
    return d?.labels?.some(l => l === "MUTED") ? 12 : 52
  }

  function titleFor(selectedSegment: Segment | SuggestedSegment): string {
    return selectedSegment.labels?.some(l => l === "MUTED") ? "Muted Segment" : "Draft Segment"
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
                parentUuid={null}
                videoId={videoUuid}
                onDelete={muteSuggestion}
              />
            </CardContent>
          </Card>
        </>
      }
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
              const Element = elementForLabels(s.labels);
              return (
                <Element segment={s}
                         style={style}
                         index={index}
                         setSelectedSegment={setSelectedSegment}
                         selected={selectedSegment?.uuid === s.uuid}/>
              );
            }
          }
        </VariableSizeList>
      </List>
    </div>
  );

}