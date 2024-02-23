import {indexToHz} from "./frequency";

describe('gets the hz', () => {
  test("basic case", ()=>{
    const sampleRate = 48000;
    expect(indexToHz(sampleRate, 1000, 999)).toEqual(24000);
    expect(indexToHz(sampleRate, 1000, 0)).toEqual(0);
  })

});

