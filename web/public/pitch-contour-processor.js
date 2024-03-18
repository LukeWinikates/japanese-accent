
// https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor
// https://developer.mozilla.org/en-US/docs/Web/API/Worklet/addModule
// white-noise-processor.js
class PitchContourProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.count = 0
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

      for (let i = 0; i < outputChannel.length; ++i) {
        outputChannel[i] = inputChannel[i];
      }
    }

    return this.isPlaying;
  }

  start() {
    this.started = true;
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

