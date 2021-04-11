export declare type Category = {
  name: string,
  categories: Category[],
}

export declare type Word = {
  word: string,
  furigana: string,
  moraCount: number,
  accentMora: number
}

export declare type CategoryDetails = {
  name: string,
  words: Word[],
}
