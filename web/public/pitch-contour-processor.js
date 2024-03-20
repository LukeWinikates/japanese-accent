// https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor
// https://developer.mozilla.org/en-US/docs/Web/API/Worklet/addModule
// white-noise-processor.js
class PitchContourProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.count = 0
    this.port.onmessage = (e) => {
      this.started = e.data === "start";
    }
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    if (!input) {
      return false;
    }

    for (let channel = 0; channel < output.length; ++channel) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];
      if (!inputChannel || !outputChannel) {
        return
      }

      this.started && this.port.postMessage(this.calculatePitchContour(inputs[0][0], 48000))

      for (let i = 0; i < outputChannel.length; ++i) {
        outputChannel[i] = inputChannel[i];
      }
    }

    return this.started;
  }
  // https://youtu.be/YHjw_yaqa9M?si=c-L4RaZjDbDQHQK8&t=3353
  calculatePitchContour(samples, sampleRate) {
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

    return result.offset / sampleRate;
  }

  static get parameterDescriptors() {
    return [
      // {
      //   name: "customGain",
      //   defaultValue: 1,
      //   minValue: 0,
      //   maxValue: 1,
      //   automationRate: "a-rate",
      // },
    ];
  }
}

registerProcessor("pitch-contour-processor", PitchContourProcessor);

