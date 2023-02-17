import {Segment, SuggestedSegment} from "../../App/api";

type MergerParams = { segments: Segment[], suggestedSegments: SuggestedSegment[] };

export function merged({suggestedSegments, segments}: MergerParams): ((Segment|SuggestedSegment)[]) {
  let toHide = segments.map(s => s.parent);
  let filteredSuggestedSegments = suggestedSegments.filter(s => !toHide.some(th => th === s.uuid));

  return [...segments, ...filteredSuggestedSegments].sort((a, b) => {
    return Math.round(a.startMS - b.startMS);
  });
}