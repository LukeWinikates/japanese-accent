type Pitch = {
  dt: number;
  ceiling: number;
  frames: PitchFrame[]
  tMax: number
  numberOfFrames: number
  z: any[]
  tMin: number;
  maxCandidateCount: number;
  t1: number
}

type Sound = {
  z: number[][];
  channelCount: number;
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

// void NUMfft_forward (NUMfft_Table table, VEC data);
/*
	Function:
		Calculates the Fourier Transform of a set of n real-valued data points.
		Replaces this data in array data [1...n] by the positive frequency half
		of its complex Fourier Transform, with a minus sign in the exponent.
	Preconditions:
		data != NULL;
		table must have been initialised with NUMfft_Table_init
	Postconditions:
		data [1] contains real valued first component (Direct Current)
		data [2..n-1] even index : real part; odd index: imaginary part of DFT.
		data [n] contains real valued last component (Nyquist frequency)

	Output parameters:

	data  r(1) = the sum from i=1 to i=n of r(i)

		If l =(int) (n+1)/2

		then for k = 2,...,l

			r(2*k-2) = the sum from i = 1 to i = n of r(i)*cos((k-1)*(i-1)*2*pi/n)

			r(2*k-1) = the sum from i = 1 to i = n of -r(i)*sin((k-1)*(i-1)*2*pi/n)

		if n is even

			 r(n) = the sum from i = 1 to i = n of (-1)**(i-1)*r(i)

		i.e., the ordering of the output array will be for n even
			r(1),(r(2),i(2)),(r(3),i(3)),...,(r(l-1),i(l-1)),r(l).
		Or ...., (r(l),i(l)) for n uneven.

 *****  note
	this transform is unnormalized since a call of NUMfft_forward
	followed by a call of NUMfft_backward will multiply the input sequence by n.
*/

// void NUMfft_backward (NUMfft_Table table, VEC data);
/*
	Function:
		Calculates the inverse transform of a complex array if it is the transform of real data.
		(Result in this case should be multiplied by 1/n.)
	Preconditions:
		n is an integer power of 2.
		data [1] contains real valued first component (Direct Current)
		data [2..n-1] even index : real part; odd index: imaginary part of DFT.
		data [n] contains real valued last component (Nyquist frequency)

		table must have been initialised with NUMfft_Table_init

	Output parameters

	data	 for n even and for i = 1,...,n

			 r(i) = r(1)+(-1)**(i-1)*r(n)

				plus the sum from k=2 to k=n/2 of

				2.0*r(2*k-2)*cos((k-1)*(i-1)*2*pi/n) -2.0*r(2*k-1)*sin((k-1)*(i-1)*2*pi/n)

		for n odd and for i = 1,...,n

			 r(i) = r(1) plus the sum from k=2 to k=(n+1)/2 of

				2.0*r(2*k-2)*cos((k-1)*(i-1)*2*pi/n) -2.0*r(2*k-1)*sin((k-1)*(i-1)*2*pi/n)

 *****  note
	this transform is unnormalized since a call of NUMfft_forward
	followed by a call of NUMfft_backward will multiply the input
	sequence by n.
*/

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
    frames,
    z: []
  };
}

function avg(numbers: number[]) {
  if (numbers.length === 0) {
    return 0
  }

  return numbers.reduce((v, m) => v + m) / numbers.length;
}

type Table = {
  n: number,
  splitCache: number[]
  trigCache: number[];
}

https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/dwsys/NUMfft_core.h#L33

// https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/dwsys/NUMfft_core.h#L109
// function NUMrffti (integer n, FFT_DATA_TYPE * wsave, integer *ifac)
  function NUMrffti(n: number, wsave: number, ifac: number) {
    // if (n == 1)
    //   return;
    // drfti1 (n, wsave + n, ifac);
  }

// https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/dwsys/NUMfft_d.cpp#L82
function createFFTTable(n: number): Table {
  let result = {
    n,
    trigCache: new Array<number>(3 * n),
    splitCache: new Array<number>(32)
  };
  return result;
  // NUMrffti (n, my trigcache.asArgumentToFunctionThatExpectsZeroBasedArray(),
  //   my splitcache.asArgumentToFunctionThatExpectsZeroBasedArray() );
}

function fttForward(fftTable: FFTTable, windowR: any) {
//   if (my n == 1)
//   return;
//   Melder_assert (my n == data.size);
//   drftf1 (my n, data.asArgumentToFunctionThatExpectsZeroBasedArray(),
//     my trigcache.asArgumentToFunctionThatExpectsZeroBasedArray(),
//     my trigcache.asArgumentToFunctionThatExpectsZeroBasedArray() + my n,
//     my splitcache.asArgumentToFunctionThatExpectsZeroBasedArray()
// );
}

function fftBackward(fftTable: FFTTable, windowR: any) {
//   if (my n == 1)
//   return;
//   Melder_assert (my n == data.size);
//   drftb1 (my n, data.asArgumentToFunctionThatExpectsZeroBasedArray(),
//     my trigcache.asArgumentToFunctionThatExpectsZeroBasedArray(),
//     my trigcache.asArgumentToFunctionThatExpectsZeroBasedArray() + my n,
//     my splitcache.asArgumentToFunctionThatExpectsZeroBasedArray()
// );
}

// https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/fon/Sound_to_Pitch.cpp#L283
function soundIntoPitch(sound: Sound, result: Pitch, param3: any) {
//static void Sound_into_Pitch (Sound_into_Pitch_Args me)
// {
// 	for (integer iframe = my firstFrame; iframe <= my lastFrame; iframe ++) {
// 		const Pitch_Frame pitchFrame = & my pitch -> frames [iframe];
// 		const double t = Sampled_indexToX (my pitch, iframe);
// 		if (my isMainThread) {
// 			try {
// 				Melder_progress (0.1 + 0.8 * (iframe - my firstFrame) / (my lastFrame - my firstFrame),
// 					U"Sound to Pitch: analysing ", my lastFrame, U" frames");
// 			} catch (MelderError) {
// 				*my cancelled = 1;
// 				throw;
// 			}
// 		} else if (*my cancelled) {
// 			return;
// 		}
// 		Sound_into_PitchFrame (my sound, pitchFrame, t,
// 			my pitchFloor, my maxnCandidates, my method, my voicingThreshold, my octaveCost,
// 			& my fftTable, my dt_window, my nsamp_window, my halfnsamp_window,
// 			my maximumLag, my nsampFFT, my nsamp_period, my halfnsamp_period,
// 			my brent_ixmax, my brent_depth, my globalPeak,
// 			my frame.get(), my ac.get(), my window, my windowR,
// 			my r, my imax.get(), my localMean.get()
// 		);
// 	}
// }
}

https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/fon/Pitch.cpp#L524
function pathfind(result: Pitch, silenceThreshold: number, voicingThreshold: number, octaveCost: number, octaveJumpCost: number, voicedUnvoicedCost: number, pitchCeiling: number) {

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

    /*
          Compute the global absolute peak for determination of silence threshold.
        */
    globalPeak = 0.0;
    for (let ichan = 0; ichan < sound.channelCount; ichan++) {
      let mean = avg(sound.z[ichan]);
      for (let i = 1; i <= sound.sampleCount; i++) {
        let value = Math.abs(sound.z[ichan][i] - mean);
        if (value > globalPeak) {
          globalPeak = value;
        }
      }
    }
    if (globalPeak === 0.0) {
      return result;
    }

    let _window, windowR;

    // cross-correlation
    if (method === "FCC_NORMAL" || method === "FCC_ACCURATE") {
      nsampFFT = 0;
      brentIxMax = Math.floor(nSampWindow * interpolationDepth);
    } else {
      // autocorrelation

      /*
        Compute the number of samples needed for doing FFT.
        To avoid edge effects, we have to append zeroes to the window.
        The maximum lag considered for maxima is maximumLag.
        The maximum lag used in interpolation is nsamp_window * interpolation_depth.
      */
      nsampFFT = 1;
      while (nsampFFT < nSampWindow * (1 + interpolationDepth)) {
        nsampFFT *= 2;
      }

      /*
        Create buffers for autocorrelation analysis.
      */
      // windowR. resize (nsampFFT);
      // _window. resize (nsamp_window);

      windowR = new Array(nsampFFT);
      _window = new Array(nSampWindow);
      let table = createFFTTable(nsampFFT);

      /*
				A Gaussian or Hanning window is applied against phase effects.
				The Hanning window is 2 to 5 dB better for 3 periods/window.
				The Gaussian window is 25 to 29 dB better for 6 periods/window.
			*/
      if (method == "AC_GAUSS") {   // Gaussian window
        let imid = 0.5 * (nSampWindow + 1);
        let edge = Math.exp(-12.0);
        for (let i = 1; i <= nSampWindow; i++) {
          _window[i] = (Math.exp(-48.0 * (i - imid) * (i - imid) /
            (nSampWindow + 1) / (nSampWindow + 1)) - edge) / (1.0 - edge);
        }
      } else {
        // Hanning window
        for (let i = 1; i <= nSampWindow; i++) {
          _window[i] = 0.5 - 0.5 * Math.cos(i * 2 * Math.PI / (nSampWindow + 1));
        }
      }


      /*
      Compute the normalized autocorrelation of the window.
      */
      for (var i = 1; i <= nSampWindow; i++) {
        windowR[i] = _window[i];
      }

      // NOTE: I made this up
      fftTable = table;
      // NUMfft_forward (& fftTable, windowR.get());
      fttForward(fftTable, windowR);
      windowR[1] *= windowR[1];   // DC component
      for (var i = 2; i < nsampFFT; i += 2) {
        windowR [i] = windowR [i] * windowR [i] + windowR [i + 1] * windowR [i + 1];
        windowR [i + 1] = 0.0;   // power spectrum: square and zero
      }
      windowR [nsampFFT] *= windowR [nsampFFT];   // Nyquist frequency
      // NUMfft_backward (& fftTable, windowR.get());   // autocorrelation
      fftBackward(fftTable, windowR);   // autocorrelation
      for (var i = 2; i <= nSampWindow; i ++) {
        windowR [i] /= windowR [1];   // normalize
      }
      windowR [1] = 1.0;   // normalize

      brentIxMax = Math.floor(nSampWindow * interpolationDepth);
    }

    // Sound to Pitch

    // skip stuff about threads for now, because parallelizing this in the browser is nontrivial
    //		integer numberOfFramesPerThread = 20;
    // 		integer numberOfThreads = (numberOfFrames - 1) / numberOfFramesPerThread + 1;
    // 		const integer numberOfProcessors = MelderThread_getNumberOfProcessors ();
    // 		trace (numberOfProcessors, U" processors");
    // 		Melder_clipRight (& numberOfThreads, numberOfProcessors);
    // 		Melder_clip (1_integer, & numberOfThreads, 16_integer);
    // 		numberOfFramesPerThread = (numberOfFrames - 1) / numberOfThreads + 1;


    soundIntoPitch(sound, result, {
      firstFrame: 1,
      lastFrame: numberOfFrames,
      pitchFloor,
      maxCandidatesNeeded,
      method,
      voicingThreshold,
      octaveCost,
      dtWindow,
      nSampWindow,
      halfNsampWindow,
      maximumLag,
      nsampFFT,
      nsampPeriod,
      halfNsampPeriod,
      brentIxMax,
      brentDepth,
      globalPeak,
      window: _window,
      windowR: windowR,
    //  arg -> rbuffer = zero_VEC (2 * nsamp_window + 1);
      // 			arg -> r = & arg -> rbuffer [1 + nsamp_window];
      // 			arg -> imax = zero_INTVEC (maxnCandidates);
      // 			arg -> localMean = zero_VEC (my ny);
    })

    pathfind(result, silenceThreshold, voicingThreshold, octaveCost, octaveJumpCost, voicedUnvoicedCost, pitchCeiling)

    return result;
  } catch (e) {
    throw new Error("pitch analysis not completed")
  }


}