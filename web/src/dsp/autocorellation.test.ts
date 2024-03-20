import autocorellate from "./autocorellation";

describe('autocorellate', () => {
  test("basic case", ()=>{
    expect(autocorellate([1,2,4,2,1,2,4,2,1,2,4,2,1], {sampleRate: 4})).toEqual(1);
  })
});

