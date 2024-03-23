type Pitch = {}
type Sound = {
  xmax: number; // start time in Seconds
  xmin: number; // end time in Seconds
  x1: number; // time of first sample in Seconds
  sampleCount: number;// "nx"
  samplingPeriodInSeconds: number; // "dx" I think this means it's the inverse of the sample rate

}

type PitchFrame = {
  candidateCount: number
  intensity: number
  candidates: PitchCandidate[]
}

type PitchCandidate = {
  frequency: number
  strength: number
}

type Method = "AC_HANNING" | "AC_GAUSS" | "FCC_NORMAL" | "FCC_ACCURATE";

class FFTTable {
}


const NUM_PEAK_INTERPOLATE_SINC70 = 3;
const NUM_PEAK_INTERPOLATE_SINC700 = 4;


function sampledShortTermAnalysis(sound: Sound, windowDuration: number, timeStep: number): { numberOfFrames: number, firstTime: number } {
  console.assert(windowDuration > 0);
  console.assert(timeStep > 0);
  let soundDuration = sound.samplingPeriodInSeconds * sound.sampleCount;
  if (windowDuration > soundDuration) {
    throw new Error("sound is shorter than Window length");
  }
  let numberOfFrames = Math.floor((soundDuration - windowDuration) / timeStep) + 1;
  console.assert(numberOfFrames >= 1);
  let midTime = sound.x1 - 0.5 * sound.samplingPeriodInSeconds + 0.5 * soundDuration;
  let targetDuration = numberOfFrames * timeStep
  let firstTime = midTime - 0.5 * targetDuration + 0.5 * timeStep
  return {
    firstTime, numberOfFrames
  }
}

// https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/fon/Pitch.cpp#L468
function createPitch(tmin: number, tmax: number, numberOfFrames: number, dt: number, t1: number, pitchCeiling: number, maxCandidatesNeeded: number): Pitch {
  let frames: PitchFrame[] = [];
  // my frames = newvectorzero <structPitch_Frame> (nt);
  /*
    Put one candidate in every frame (unvoiced, silent).
  */
  for (let i = 1; i <= numberOfFrames; i++) {
    frames.push({
      candidateCount: 1, intensity: 0,
      candidates: [{
        frequency: 0,
        strength: 0
      }]
    });
  }

  return {
    tMin: tmin,
    tMax: tmax,
    numberOfFrames,
    dt,
    t1,
    ceiling: pitchCeiling,
    maxCandidateCount: maxCandidatesNeeded,
    frames
  };
}

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
): Pitch {

  try {
    let fftTable: FFTTable; // used much later, line https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/fon/Sound_to_Pitch.cpp#L447
    let t1: number;
    let numberOfFrames: number;
    let nsampFFT: number // number of samples for FFT?
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

    let duration = sound.samplingPeriodInSeconds * sound.sampleCount;   // volatile, because we need to truncate to 64 bits

    if (pitchFloor < periodsPerWindow / duration) {
      throw new Error("To analyse this Sound, “pitch floor” must not be less than " + periodsPerWindow / duration + " Hz.");
    }

    /*
      Determine the number of samples in the longest period.
      We need this to compute the local mean of the sound (looking one period in both directions),
      and to compute the local peak of the sound (looking half a period in both directions).
    */
    let nsampPeriod = Math.floor(1.0 / sound.samplingPeriodInSeconds / pitchFloor);
    let halfNsampPeriod = nsampPeriod / 2 + 1;

    pitchCeiling = Math.max(pitchCeiling, 0.5 / sound.samplingPeriodInSeconds)

    /*
        Determine window duration in seconds and in samples.
    */
    let dtWindow = periodsPerWindow / pitchFloor;
    let nSampWindow = Math.floor(dtWindow / sound.samplingPeriodInSeconds);
    let halfNsampWindow = nSampWindow / 2 - 1;
    if (nSampWindow < 2) {
      throw new Error("Analysis window too short.");
    }

    nSampWindow = halfNsampWindow * 2;

    /*
   * Determine the minimum and maximum lags.
   */

    // TODO: this literal "2" may be entirely wrong
    // In the CPP original, it is 2_integer, and that value appears here:
    // https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/external/clapack/READ_ME.TXT#L65
    let minimumLag = Math.max(2, Math.floor(1.0 / sound.samplingPeriodInSeconds / pitchCeiling));
    let maximumLag = Math.min(Math.floor(nSampWindow / periodsPerWindow) + 2, nSampWindow);

    /*
         * Determine the number of frames.
         * Fit as many frames as possible symmetrically in the total duration.
         * We do this even for the forward cross-correlation method,
         * because that allows us to compare the two methods.
         */
    try {
      let windowDuration = method === "FCC_ACCURATE" || method == "FCC_NORMAL" ?
        1.0 / pitchFloor + dtWindow :
        dtWindow;
      let analysis = sampledShortTermAnalysis(sound, windowDuration, dt);
      numberOfFrames = analysis.numberOfFrames;
      t1 = analysis.firstTime
    } catch (e) {
      throw new Error("The pitch analysis would give zero pitch frames.");
    }

    /*
			Create the resulting pitch contour.
		*/
    let result: Pitch = createPitch(
      sound.xmin, sound.xmax,
      numberOfFrames, dt, t1,
      pitchCeiling, maxCandidatesNeeded);


    return result;
  } catch (e) {
    throw new Error("pitch analysis not completed")
  }


}