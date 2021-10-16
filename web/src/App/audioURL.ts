export default function audioURL({videoUuid, start, end}:{videoUuid :string, start: number, end:number}) : string {
  return `/media/audio/${videoUuid}#t=${start / 1000},${end / 1000}`;
}