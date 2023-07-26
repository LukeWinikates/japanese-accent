export type Cursor<T> = {
  index: number,
  collection: T[],
  value: T | null
}

export function newCursor<T>(collection: T[]): Cursor<T> {
  return {
    index: 0,
    value: collection[0],
    collection: collection
  }
}

export function setValue<T>(cursor: Cursor<T>, value: T): Cursor<T> {
  let collection = [...cursor.collection];
  let newValue = {...value};
  collection[cursor.index] = newValue
  return {
    index: cursor.index,
    value: newValue,
    collection: collection
  }
}

export function remove<T>(cursor: Cursor<T>): Cursor<T> {
  let collection = [...cursor.collection];
  collection.splice(cursor.index, 1);
  return {
    index: cursor.index,
    value: collection[cursor.index],
    collection: collection
  }
}

export function move<T>(cursor: Cursor<T>, newIndex: number) : Cursor<T> {
  const collection = cursor.collection;
  return {
    index: newIndex,
    value: collection[newIndex],
    collection: collection
  }
}
