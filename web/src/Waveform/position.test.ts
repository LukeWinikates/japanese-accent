import {msToPctOfRange} from './position';

test('msToPctOfRange', ()=>{
  expect(msToPctOfRange({startMS: 15_000, endMS: 30_000}, 18_000)).toBe(20);
  expect(msToPctOfRange({startMS: 0, endMS: 5590}, 450)).toBe(8.050089445438283);
});