export function secondsToHumanReadable(sec: number) {
  const totalSeconds = Math.floor(sec);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  return `${minutes}:${("" + seconds).padStart(2, "0")}`;
}

export function msToHumanReadable(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  return `${minutes}:${("" + seconds).padStart(2, "0")}.${Math.round((ms % 1000) / 100)}`;
}

export function rangeToHumanReadable(startMS: number, endMS: number)  {
  return `${msToHumanReadable(startMS)}-${msToHumanReadable(endMS)} (${msToHumanReadable(endMS-startMS)})`
}
export type Range = { startMS: number, endMS: number };
