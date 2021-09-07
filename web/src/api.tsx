export declare type Category = {
  name: string,
  categories: Category[],
}

export declare type CategoriesResponse = {
  categories: Category[],
  media: VideoSummary[],
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

export declare type VideoSummary = {
  title: string,
  url: string,
  videoId: string,
}


export declare type Video = {
  title: string,
  url: string,
  videoId: string,
  segments: Segment[],
  videoStatus: "Pending" | "Imported";
}

export declare type CategoryDetails = {
  name: string,
  words: Word[],
}

export declare type Segment = {
  start: number,
  end: number,
  text: string,
  uuid: string,
};

export declare type Highlights = {
  videos: VideoSummary[],
  categories: Category[]
}


export function duration(segment: Segment): number {
  return (segment.end - segment.start) / 1000;
}
