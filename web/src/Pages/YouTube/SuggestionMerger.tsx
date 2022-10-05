import {DraftSegment} from "../../App/api";
import {Labeled} from "../../App/Labeled";

type MergerParams = { draftSegments: DraftSegment[], suggestedSegments: DraftSegment[] };

export function merged(segments: MergerParams): Labeled<'suggested' | 'draft', DraftSegment>[] {
  const {suggestedSegments} = segments;
  return suggestedSegments.map((v) => ({
    label: 'suggested',
    value: v
  }));
}