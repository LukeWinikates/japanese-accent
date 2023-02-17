import React, {useState} from "react";
import {Segment, SegmentLabel, SuggestedSegment, Video, VideoAdvice} from "../../App/api";
import {Card, CardContent, List,} from "@mui/material";
import {Pager} from "../../Dictaphone/Pager";
import {merged} from "../YouTube/SuggestionMerger";
import {SuggestedListItem} from "../YouTube/SuggestedListItem";
import {DraftListItem} from "../YouTube/DraftListItem";
import {VariableSizeList} from 'react-window';
import {MutedListItem} from "../YouTube/MutedListItem";
import {Editor} from "./Editor";
import {ARE_ADVICE, ARE_MUTED} from "./segment";

type TimelineProps = {
  advice: VideoAdvice,
  video: Video,
  videoUuid: string,
  muteSuggestion: (segment: SuggestedSegment) => void,
}

export function Timeline({advice, videoUuid, video, muteSuggestion}: TimelineProps) {
  const [selectedSegment, setSelectedSegment] = useState<Segment | SuggestedSegment | null>(null);//advice.suggestedSegments[0]);

  const selectedSegmentIndex = advice.suggestedSegments.findIndex(s => s.uuid === selectedSegment?.uuid)

  const segmentsForTimeline = merged({
    suggestedSegments: advice.suggestedSegments,
    segments: video.segments,
  });

  function selectedSegmentByIndex(index: number) {
    setSelectedSegment(advice.suggestedSegments[index]);
  }

  function elementForLabels(labels: SegmentLabel[]) {
    if (!labels) {
      return SuggestedListItem
    }

    if (labels.some(ARE_MUTED)) {
      return MutedListItem;
    }

    if (labels.some(ARE_ADVICE)) {
      return DraftListItem;
    }
    return SuggestedListItem;
  }

  const sizeFor = (index: number) => {
    const d = segmentsForTimeline[index];
    return d?.labels?.some(l => l === "MUTED") ? 12 : 52
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