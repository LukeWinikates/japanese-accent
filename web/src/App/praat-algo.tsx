type Pitch = {

}
type Sound = {

}

type Method = "AC_HANNING" | "AC_GAUSS" | "FCC_NORMAL" | "FCC_ACCURATE";

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

  } catch (e) {
    throw new Error("pitch analysis not completed")
  }

  return {};
}