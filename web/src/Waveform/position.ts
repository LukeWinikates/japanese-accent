export const msToPctOfRange = (windowRange:{endMS: number, startMS: number}, ms: number) => {
  // what is the total
  // e.g. windowRange = {15s, 30s}, ms: 18s
  // rangeDuration = 15s
  const rangeDuration = windowRange.endMS - windowRange.startMS;
  if (rangeDuration === 0) {
    return 0
  }

  // how many ms into the range are we? in this case, 3s
  const relativeToStart = ms - windowRange.startMS;

  // 3s / 15s = .2,
  // |> * 100 = 20
  return (relativeToStart / rangeDuration) * 100;
}