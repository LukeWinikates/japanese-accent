import {ClipLabel} from "../../api/types";

export const ARE_MUTED = (l: ClipLabel): boolean => {
  return l === "MUTED";
}
export const ARE_ADVICE = (l: ClipLabel): boolean => {
  return l === "ADVICE";
}

