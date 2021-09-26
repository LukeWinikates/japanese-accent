export function secondsToHumanReadable(sec: number) {
  const totalSeconds = Math.round(sec);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  return `${minutes}:${("" + seconds).padStart(2, "0")}`;
}

export function msToHumanReadable(ms: number) {
  const totalSeconds = Math.round(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  return `${minutes}:${("" + seconds).padStart(2, "0")}.${ms % 1000}`;
}