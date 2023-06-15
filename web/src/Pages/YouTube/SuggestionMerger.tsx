import {BasicClip, Clip} from "../../api/types";

type MergerParams = { clips: Clip[], suggestions: BasicClip[] };

export function merged({suggestions, clips}: MergerParams): (BasicClip[]) {
  let toHide = clips.map(s => s.parent);
  let filteredSuggestions = suggestions.filter(s => !toHide.some(th => th === s.uuid));

  return [...clips, ...filteredSuggestions].sort((a, b) => {
    return Math.round(a.startMS - b.startMS);
  });
}