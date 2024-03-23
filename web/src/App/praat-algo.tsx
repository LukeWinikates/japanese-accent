type Pitch = {

}
type Sound = {

}

type Method = "AC_HANNING" | "AC_GAUSS" | "FCC_NORMAL" | "FCC_ACCURATE";

class FFTTable {
}

const NUM_PEAK_INTERPOLATE_SINC70 = 3;
const NUM_PEAK_INTERPOLATE_SINC700 = 4;

function SoundToPitchGeneric(sound: Sound,
                             method: Method,
                             periodsPerWindow: number,
                             dt: number,
                             pitchFloor: number,
                             pitchCeiling: number,
                             maxCandidatesNeeded: number,
                             silenceThreshold: number,
                             voicingThreshold: number,
                             octaveCost: number,
                             octaveJumpCost: number,
                             voicedUnvoicedCost: number
) : Pitch {

  try {
    let fftTable : FFTTable; // used much later, line https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/fon/Sound_to_Pitch.cpp#L447
    let t1: number;
    let numberOfFrames: number;
    let nsampFFT : number // number of samples for FFT?
    let interpolationDepth: number
    let brentIxMax, brentDepth: number
    let globalPeak: number;

    console.assert(maxCandidatesNeeded >= 2);
    // skip a type assertion that we don't need.

    // Praat's Melder_ifloor does some constraint checking and returns an actual int value
    if (maxCandidatesNeeded < pitchCeiling / pitchFloor) {
      maxCandidatesNeeded = Math.floor(pitchCeiling / pitchFloor);
    }

    if (dt <= 0.0) {
      dt = periodsPerWindow / pitchFloor / 4.0;   // e.g. 3 periods, 75 Hz: 10 milliseconds
    }

    switch (method) {
      case "AC_HANNING":
        brentDepth = NUM_PEAK_INTERPOLATE_SINC70;
        interpolationDepth = 0.5;
        break;
      case "AC_GAUSS":
        periodsPerWindow *= 2;   // because Gaussian window is twice as long
        brentDepth = NUM_PEAK_INTERPOLATE_SINC700;
        interpolationDepth = 0.25;   // because Gaussian window is twice as long
        break;
      case "FCC_NORMAL":
        brentDepth = NUM_PEAK_INTERPOLATE_SINC70;
        interpolationDepth = 1.0;
        break;
      case "FCC_ACCURATE":
        brentDepth = NUM_PEAK_INTERPOLATE_SINC700;
        interpolationDepth = 1.0;
        break;
    }

  } catch (e) {
    throw new Error("pitch analysis not completed")
  }

  return {};
}