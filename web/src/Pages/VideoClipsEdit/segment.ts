import {SegmentLabel} from "../../App/api";

export const ARE_MUTED = (l: SegmentLabel): boolean => {
  return l === "MUTED";
}
export const ARE_ADVICE = (l: SegmentLabel): boolean => {
  return l === "ADVICE";
}

