//xmin			// Start time (seconds).
// 	xmax > xmin		// End time (seconds).
// 	nx >= 1			// Number of time slices.
// 	dx > 0.0		// Time step (seconds).
// 	x1			// Centre of first time slice (seconds).
// 	ceiling			// Candidates with a higher frequency are unvoiced.
// 	maxnCandidates >= 1	// Maximum number of candidates per time slice.
// 	frame[1..nx].nCandidates	// Number of candidates in each time slice, including the unvoiced candidate.
// 	frame[1..nx].candidate[1..nCandidates].frequency
// 		// The frequency of each candidate (Hz), 0 means aperiodic or silent.
// 		// candidate[1].frequency is the frequency of the currently best candidate.
// 	frame[1..nx].candidate[1..nCandidates].strength
// 		// The strength of each candidate, a real number between 0 and 1:
// 		// 0 means not periodic at all, 1 means perfectly periodic;
// 		// if the frequency of the candidate is 0, its strength is a real number
// 		// that represents the maximum periodicity that
// 		// can still be considered to be due to noise (e.g., 0.4).
// 		// candidate[1].strength is the strength of the currently best candidate.
// 	frame[1..nx].intensity
// 		// The relative intensity of each frame, a real number between 0 and 1.

type Pitch = {
  dx: number;
  ceiling: number;
  frames: PitchFrame[]
  xMax: number
  numberOfFrames: number
  z: any[]
  xMin: number;
  maxCandidateCount: number;
  x1: number
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

type FFTTable = Table;


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

// Pitch_create (double tmin, double tmax, integer nt, double dt, double t1, double ceiling, integer maxnCandidates)
// Sampled_init (me.get(), tmin, tmax, nt, dt, t1);
// void Sampled_init (Sampled me, double xmin, double xmax, integer nx, double dx, double x1) {
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
    xMin: tmin,
    xMax: tmax,
    numberOfFrames,
    dx: dt,
    x1: t1,
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
  NUMrffti(result);
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

// https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/fon/Sampled.h#L34
function sampledXToLowIndex(sound: Sound, t: number): number {
// (Sampled me, double x) { return Melder_ifloor   ((x - my x1) / my dx + 1.0); }
  return Math.floor((t - sound.x1) / sound.samplingPeriodInSeconds + 1);
}

type Param3 = {
  ac: number[];
  brentDepth: number;
  brentIxMax: number;
  dtWindow: number;
  fftTable: Table;
  firstFrame: number;
  globalPeak: number;
  halfNSampPeriod: number;
  halfNSampWindow: number;
  // halfNsampPeriod: number;
  // halfNsampWindow: number
  imax: number[];
  lastFrame: number;
  localMean: number[];
  maxCandidatesNeeded: number;
  maximumLag: number;
  method: Method;
  nSampWindow: number;
  nsampFFT: number;
  nsampPeriod: number
  octaveCost: number;
  pitchFloor: number;
  r: number[];
  rbuffer: number[];
  voicingThreshold: number;
  window: number[];
  windowR: number[];
};

https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/melder/NUMinterpol.cpp#L36
  function interpolateSinc(): number {
    throw new Error("not implemented");
    return 0;
  }

function improveMaximum(): number {
  return 0;
}

// https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/fon/Sound_to_Pitch.cpp#L45
function soundIntoPitchFrame(sound: Sound, frame: PitchFrame, t: number, param3: Param3) {
  let leftSample = sampledXToLowIndex(sound, t);
  let rightSample = leftSample + 1;
  let startSample = 0, endSample = 0;

  // TODO: look at the sound.z attribute and think about 0 vs 1-based indexing of the channels
  for (let channel = 1; channel <= sound.channelCount; channel++) {
    /*
      Compute the local mean; look one longest period to both sides.
    */
    startSample = rightSample - param3.nsampPeriod;
    endSample = leftSample + param3.nsampPeriod;
    console.assert(startSample >= 1);
    console.assert(endSample <= sound.sampleCount) // "my nx"

    param3.localMean[channel] = 0;
    for (let i = startSample; i <= endSample; i++) {
      param3.localMean[channel] += sound.z[channel][i];
    }

    param3.localMean[channel] /= 2 * param3.nsampPeriod;

    /*
      Copy a window to a frame and subtract the local mean.
      We are going to kill the DC component before windowing.
    */
    startSample = rightSample - param3.halfNSampWindow;
    endSample = leftSample + param3.halfNSampWindow;
    console.assert(startSample >= 1);
    console.assert(endSample <= sound.sampleCount);
    // 	if (method < FCC_NORMAL) {
    if (param3.method === "AC_HANNING" || param3.method === "AC_GAUSS") {
      for (let j = 1, i = startSample; j <= param3.nSampWindow; j++) {
        frame[channel][j] = (sound.z[channel][i++] - param3.localMean[channel]) * param3.window[j]
      }
      for (let j = param3.nSampWindow + 1; j <= param3.nsampFFT; j++) {
        frame[channel][j] = 0;
      }
    } else {
      for (let j = 1, i = startSample; j <= param3.nSampWindow; j++) {
        frame[channel][j] = sound.z[channel][i++] - param3.localMean[channel];
      }
    }
  }


  /*
    Compute the local peak; look half a longest period to both sides.
  */

  let localPeak = 0.0;
  if ((startSample = param3.halfNSampWindow + 1 - param3.halfNSampPeriod) < 1) {
    startSample = 1;
  }
  if ((endSample = param3.halfNSampWindow + param3.halfNSampPeriod) > param3.nSampWindow) {
    endSample = param3.nSampWindow
  }

  for (let channel = 1; channel <= sound.channelCount; channel++) {
    for (let j = startSample; j <= endSample; j++) {
      let value = Math.abs(frame[channel][j]);
      if (value > localPeak) {
        localPeak = value;
      }
    }
  }

  frame.intensity = (localPeak > param3.globalPeak ?
    1.0 : localPeak / param3.globalPeak);

  /*
    Compute the correlation into the array 'r'.
  */
  if (param3.method === "FCC_ACCURATE" || param3.method === "FCC_NORMAL") {
    let startTime = t - 0.5 * (1.0 / param3.pitchFloor + param3.dtWindow);
    let localSpan = param3.maximumLag + param3.nSampWindow;
    if ((startSample = sampledXToLowIndex(sound, startSample)) < 1) {
      startSample = 1;
    }
    if (localSpan > sound.sampleCount + 1 - startSample) {
      localSpan = sound.sampleCount + 1 - startSample;
    }
    let localMaximumLag = localSpan - param3.nSampWindow;
    let offset = startSample - 1;
    let sumx2 = 0.0; // sum of squares
    for (let channel = 1; channel <= sound.channelCount; channel++) {
      // TODO: decipher this - it looks like it's grabbing a mutable reference to a particular cell position
      // 			const double * const amp = & my z [channel] [0] + offset;
      for (let i = 1; i <= param3.nSampWindow; i++) {
        let x = sound.z[channel][i + offset] - param3.localMean[channel];
        sumx2 += x * x;
      }
    }
    let sumy2 = sumx2;
    param3.r[0] = 1;
    for (var i = 1; 1 <= localMaximumLag; i++) {
      let product = 0;
      for (let channel = 1; channel <= sound.channelCount; channel++) {
        let y0 = sound.z[channel][i + offset] - param3.localMean[channel];
        let yZ = sound.z[channel][i + offset + +param3.nSampWindow] - param3.localMean[channel];
        sumy2 += yZ * yZ - y0 * y0;
        for (let j = 1; j <= param3.nSampWindow; j++) {
          let x = sound.z[channel][offset + j] - param3.localMean [channel];
          let y = sound.z[channel][offset + i + j] - param3.localMean [channel];
          product += x * y;
        }
      }

      // TODO: decipher this line - why is -i not out of bounds
      // what does assigning to an array cell return?
      // 			r [- i] = r [i] = (double) product / sqrt ((double) sumx2 * (double) sumy2);
      param3.r[-i] = param3.r[i] = product / Math.sqrt(sumx2 * sumy2);
    }
  } else {
    for (let i = 1; i <= param3.nsampFFT; i++) {
      param3.ac[i] = 0.0;
    }

    for (let channel = 1; channel <= sound.channelCount; channel++) {
      // NUMfft_forward (fftTable, VEC (& frame [channel] [1], fftTable->n));   // complex spectrum
      let array = new Array<number>(param3.fftTable.n);
      array.fill(frame[channel][1]);
      fttForward(param3.fftTable, array)
      param3.ac[1] += frame[channel][1] * frame[channel][1]  // DC component
      for (let i = 2; i < param3.nsampFFT; i += 2) {
        // power spectrum
        param3.ac[i] += frame[channel][i] * frame[channel][i] + frame[channel][i + 1] * frame[channel][i + 1];
        // Nyquist frequency
        param3.ac[param3.nsampFFT] += frame[channel][param3.nsampFFT] * frame [channel] [param3.nsampFFT];
      }
    }

    // autocorrelation
    fftBackward(param3.fftTable, param3.ac)

    /*
Normalize the autocorrelation to the value with zero lag,
and divide it by the normalized autocorrelation of the window.
*/
    param3.r[0] = 1.0;
    for (let i = 1; i <= param3.brentIxMax; i++) {
      param3.r[-i] = param3.r[i] = param3.ac[i + 1] /
        (param3.ac [1] * param3.windowR [i + 1]);
    }

  }

  /*
  Register the first candidate, which is always present: voicelessness.
*/
  // TODO: had to translate this to zero-indexed - perhaps that will make it incorrect
  frame.candidates.slice(0, 1)
  frame.candidateCount = 1
  frame.candidates[0].frequency = 0.0;
  frame.candidates[0].strength = 0.0;

  if (localPeak === 0) {
    return
  }

  param3.imax[1] = 0;
  for (let i = 2; i < param3.maximumLag && i < param3.brentIxMax; i++) {
    if (param3.r[i] > 0.5 * param3.voicingThreshold && // not too unvoiced?
      param3.r[i] > param3.r[i - 1] && param3.r[i] >= param3.r[i + 1]) { // maximum?
      let place = 0;

      let {r, brentIxMax} = param3;
      /*
      Use parabolic interpolation for first estimate of frequency,
      and sin(x)/x interpolation to compute the strength of this frequency.
      */
      let dr = 0.5 * (r[i + 1] - r[i - 1]);
      let d2r = 2.0 * r[i] - r [i - 1] - r [i + 1];
      let frequencyOfMaximum = 1.0 / sound.samplingPeriodInSeconds / (i + dr / d2r);
      let offset = -brentIxMax - 1;
      let strengthOfMaximum = /* method & 1 ? */
          interpolateSinc()
        // NUM_interpolate_sinc (constVEC (& r [offset + 1], brent_ixmax - offset), 1.0 / my dx / frequencyOfMaximum - offset, 30)
        /* : r [i] + 0.5 * dr * dr / d2r */;
      /*
        High values due to short windows are to be reflected around 1.
      */
      if (strengthOfMaximum > 1.0) {
        strengthOfMaximum = 1.0 / strengthOfMaximum;
      }

      if (frame.candidateCount < param3.maxCandidatesNeeded) {
        frame.candidates.push({frequency: frequencyOfMaximum, strength: strengthOfMaximum})
        frame.candidateCount++;
        param3.imax[place] = i;
      } else {
        let weakest = 2.0;
        for (let iWeak = 2; iWeak <= param3.maxCandidatesNeeded; iWeak++) {
          const localStrength = frame.candidates[iWeak].strength - param3.octaveCost *
            Math.log2(param3.pitchFloor / frame.candidates[iWeak].frequency);
          if (localStrength < weakest) {
            weakest = localStrength;
            place = iWeak;
          }
        }
        if (strengthOfMaximum - param3.octaveCost * Math.log2(param3.pitchFloor / frequencyOfMaximum) <= weakest) {
          place = 0;
        }
        if (!!place) {
          frame.candidates[place] = {frequency: frequencyOfMaximum, strength: strengthOfMaximum}
          param3.imax[place] = i;
        }
      }

    }


  }

  /*
    Second pass: for extra precision, maximize sin(x)/x interpolation ('sinc').
  */
  for (let i = 2; i <= frame.candidateCount; i++) {
    if (param3.method !== "AC_HANNING" || frame.candidates[i].frequency > 0.0 / sound.samplingPeriodInSeconds) {
      let xmid: number, ymid: number;
      let offset = -param3.brentIxMax - 1;
      ymid = improveMaximum();
      // ymid = NUMimproveMaximum (constVEC (& r [offset + 1], brent_ixmax - offset), imax [i] - offset,
      //   pitchFrame -> candidates [i]. frequency > 0.3 / my dx ? NUM_PEAK_INTERPOLATE_SINC700 : brent_depth, & xmid);
      xmid += offset;
      frame.candidates[i].frequency = 1.0 / sound.samplingPeriodInSeconds / xmid;
      if (ymid > 1.0) {
        ymid = 1.0 / ymid;
      }
      frame.candidates [i].strength = ymid;
    }
  }
}


// https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/fon/Sampled.h#L32
function sampledIndexToX(result: Pitch, frameIndex: number): number {
  return result.x1 + (frameIndex - 1) * result.dx;
}

// https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/fon/Sound_to_Pitch.cpp#L283
function soundIntoPitch(sound: Sound, result: Pitch, param3: Param3) {
  result.frames.forEach((frame, i) => {
    let t = sampledIndexToX(result, i);
    soundIntoPitchFrame(sound, frame, t, param3);
  });
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

// https://github.com/praat/praat/blob/4c4f8db2ccb06d7778914024858c7279ca82f4bc/fon/Pitch.cpp#L524
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

    let _window, windowR: number[];

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
      if (method === "AC_GAUSS") {   // Gaussian window
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
      for (var i = 2; i <= nSampWindow; i++) {
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


    pathfind(result, silenceThreshold, voicingThreshold, octaveCost, octaveJumpCost, voicedUnvoicedCost, pitchCeiling)

    soundIntoPitch(sound, result, {
      // 			arg -> r = & arg -> rbuffer [1 + nsamp_window];
      // r -- a pointer to rbuffer[1 + nsamWindow]?
      ac: [],
      brentDepth,
      brentIxMax,
      dtWindow,
      fftTable,
      firstFrame: 1,
      globalPeak,
      halfNSampPeriod: halfNsampPeriod,
      halfNSampWindow: halfNsampWindow,
      imax: new Array<number>(maxCandidatesNeeded),
      lastFrame: numberOfFrames,
      localMean: new Array<number>(sound.channelCount),
      maxCandidatesNeeded,
      maximumLag,
      method,
      nSampWindow,
      nsampFFT,
      nsampPeriod,
      octaveCost,
      pitchFloor,
      r: [],
      rbuffer: new Array<number>(2 * nSampWindow + 1),
      voicingThreshold,
      window: _window,
      windowR: windowR,

    })

    return result;
  } catch (e) {
    throw new Error("pitch analysis not completed")
  }
}