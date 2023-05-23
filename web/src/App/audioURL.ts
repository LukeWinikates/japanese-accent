import {WordAnalysis} from "../api/types";

export default function audioURL({videoUuid, startMS, endMS}:{videoUuid :string, startMS: number, endMS:number}) : string {
  return `/media/audio/${videoUuid}#t=${startMS / 1000},${endMS / 1000}`;
}

export function audioURLForWordAndIndex(word: WordAnalysis, index: number) : string {
  return word.audio[index]?.url || "";
}
