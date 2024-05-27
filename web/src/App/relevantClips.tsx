import {TimedText} from "../api/types";

export function relevantClips(timeMS: number, timedTexts: TimedText[]):TimedText[] {
  try {
    const {index} = closestIn(timedTexts, timeMS, c => c.timeMS);
    return timedTexts.slice(Math.max(index - 3, 0), Math.min(index + 3, timedTexts.length - 1));
  } catch {
    return []
  }
}

export function closestIn<T>(list: T[], timeMS: number, extractor: (t: T) => number): { item: T, index: number } {
  if (timeMS < extractor(list[0])) {
    return {item: list[0], index: 0};
  }
  const lastIndex = list.length - 1;
  if (timeMS > extractor(list[lastIndex])) {
    return {item: list[lastIndex], index: lastIndex}
  }

  let range = [0, lastIndex];
  let idx = Math.ceil(list.length / 2);
  while (range[1] - range[0] > 1) {
    const value = extractor(list[idx]);
    if (value === timeMS) {
      break
    }
    if (value < timeMS && timeMS < extractor(list[idx + 1])) {
      break
    }
    if (timeMS < value) {
      range = [range[0], idx - 1];
    }
    if (value < timeMS) {
      range = [idx + 1, range[1]]
    }
    idx = Math.ceil(range[1] - range[0] / 2) + range[0]
  }

  return {item: list[idx], index: idx}
}