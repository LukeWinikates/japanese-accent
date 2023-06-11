import {BasicClip, Clip} from "../../api/types";

type MergerParams = { segments: Clip[], suggestedSegments: BasicClip[] };

export function merged({suggestedSegments, segments}: MergerParams): (BasicClip[]) {
  let toHide = segments.map(s => s.parent);
  let filteredSuggestedSegments = suggestedSegments.filter(s => !toHide.some(th => th === s.uuid));

  return [...segments, ...filteredSuggestedSegments].sort((a, b) => {
    return Math.round(a.startMS - b.startMS);
  });
}