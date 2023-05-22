import {idFrom} from "./linkParser";

test('works with all the variants', () => {
  expect(idFrom('https://www.youtube.com/watch?v=7s3DL2wCMEk')).toBe('7s3DL2wCMEk');
  expect(idFrom('7s3DL2wCMEk')).toBe('7s3DL2wCMEk');
  expect(idFrom('https://youtu.be/7s3DL2wCMEk')).toBe('7s3DL2wCMEk');

  expect(idFrom('https://www.youtube.com/watch?v=aFBL-77S_MM')).toBe('aFBL-77S_MM');
  expect(idFrom('aFBL-77S_MM')).toBe('aFBL-77S_MM');
  expect(idFrom('https://youtu.be/aFBL-77S_MM')).toBe('aFBL-77S_MM');
});

test('returns null for random stuff', () => {
  expect(idFrom('https://www.youtube.com/watch?v=7s3DL2wC')).toBe(null);
  expect(idFrom('adsf')).toBe(null);
  expect(idFrom('https://youtub')).toBe(null);
});

