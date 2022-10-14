import {DraftSegment} from "../../App/api";

type MergerParams = { draftSegments: DraftSegment[], suggestedSegments: DraftSegment[] };

export function merged(segments: MergerParams): (DraftSegment[]) {
  const {suggestedSegments, draftSegments} = segments;
  let drafts = draftSegments.filter((v: DraftSegment) => v.labels && v.labels[0] === "MUTED");

  return [...suggestedSegments, ...drafts].sort((a, b) => {
    return Math.round(a.startMS - b.startMS);
  });
}