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
  shiki: string,
}

export declare type Link = {
  text: string,
  url: string,
  videoId: string,
}

export declare type CategoryDetails = {
  name: string,
  words: Word[],
  suzukiKunAction: string,
  links: Link[],
}
