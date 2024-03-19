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

      this.started && this.port.postMessage("1000hz")

      for (let i = 0; i < outputChannel.length; ++i) {
        outputChannel[i] = inputChannel[i];
      }
    }

    return this.started;
  }
  // https://youtu.be/YHjw_yaqa9M?si=c-L4RaZjDbDQHQK8&t=3353
  calculatePitchContour(values) {
    let windowSize = 80
    let overlapSize = 20
    let stepSize = windowSize - overlapSize
    let idx = 0;
    let N = values.length
    for(var k = 0; k < (N - windowSize); k += stepSize) {
      // for each offset from the starting position, check to see how aligned the intensities are
      // if they are very similar, we have high correlation
      for (var T = minT; T < maxT; T++) {

      }
      var f0 = 1/T;

    }
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

