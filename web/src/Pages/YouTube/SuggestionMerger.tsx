import {Segment, SuggestedSegment} from "../../App/api";

type MergerParams = { segments: Segment[], suggestedSegments: SuggestedSegment[] };

export function merged({suggestedSegments, segments}: MergerParams): ((Segment|SuggestedSegment)[]) {
  // const {suggestedSegments, segments} = segments;
  let drafts = segments.filter((v: Segment) => v.labels && v.labels[0] === "MUTED");

  return [...suggestedSegments, ...drafts].sort((a, b) => {
    return Math.round(a.startMS - b.startMS);
  });
}