import {closestIn} from "./relevantClips";

describe('closestIn finds the closest match in a list', () => {
  function identity<T>(t: T) {
    return t;
  }

  test("basic case", ()=>{
    let list = [1, 2, 3, 6, 7, 8]
    let item = 4;
    expect(closestIn(list, item, identity)).toEqual({item: 3, index: 2});
  })

  test("first item is closest", ()=>{
    let list = [5, 6, 7, 8]
    let item = 4;
    expect(closestIn(list, item, identity)).toEqual({item: 5, index: 0});
  })

  test("last item is closest", ()=>{
    let list = [5, 6, 7, 8]
    let item = 9;
    expect(closestIn(list, item, identity)).toEqual({item: 8, index: 3});
  })

  test("2nd to last item is closest", ()=>{
    let list = [5, 6, 7, 8, 11]
    let item = 9;
    expect(closestIn(list, item, identity)).toEqual({item: 8, index: 3});
  })

  test("2nd item is closest", ()=>{
    let list = [4, 7, 8, 11]
    let item = 6;
    expect(closestIn(list, item, identity)).toEqual({item:7, index: 1});
  })
});

