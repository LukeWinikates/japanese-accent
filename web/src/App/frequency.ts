
export function indexToHz(sampleRate: number, binCount:number, index:number):number {
  let max = sampleRate / 2
  let bucketSize = max / (binCount - 1)
  return index * bucketSize
}