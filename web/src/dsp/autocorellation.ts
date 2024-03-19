export default function autocorellate(samples: number[], options: { sampleRate: number }): number {
  var windowSize = 8;
  let overlapSize = 6
  let stepSize = 1
  let idx = 0;
  let N = samples.length
  var result = {offset: 1, score: 0}
  for (var k = 1; k < samples.length - windowSize; k += stepSize) {
    // for each offset from the starting position, check to see how aligned the intensities are
    // if they are very similar, we have high correlation
    var score = 0;
    for (var i = 0; i < windowSize; i++) {
      score += samples[i] * samples[i + k];
    }

    if (score > result.score) {
      result = {offset: k, score: score}
    }
  }

  return result.offset / options.sampleRate;
}