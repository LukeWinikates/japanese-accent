import {SegmentLabel} from "../../api/types";

export const ARE_MUTED = (l: SegmentLabel): boolean => {
  return l === "MUTED";
}
export const ARE_ADVICE = (l: SegmentLabel): boolean => {
  return l === "ADVICE";
}

