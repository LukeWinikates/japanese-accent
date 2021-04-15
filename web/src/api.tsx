export declare type Category = {
  name: string,
  categories: Category[],
}

export declare type Word = {
  word: string,
  furigana: string,
  morae: string[],
  moraCount: number,
  accentMora: number | null,
  link: string,
}

export declare type CategoryDetails = {
  name: string,
  words: Word[],
  suzukiKunAction: string,
}
