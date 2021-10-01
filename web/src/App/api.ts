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
  videoStatus: VideoStatus
  lastActivityAt: string
}


export type VideoStatus = "Pending" | "Imported" | "Complete";

export declare type Video = {
  title: string,
  url: string,
  videoId: string,
  segments: Segment[],
  videoStatus: VideoStatus;
  lastActivityAt: string
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
  videoUuid: string,
  lastActivityAt: Date
};

export declare type Highlights = {
  videos: VideoSummary[],
  categories: Category[]
}

export declare type Activity = {
  segmentId: string,
  activityType: "PracticeStart"
}

export declare type Playlist = {
  id: string,
  title: string,
  segments: Segment[],
}

export function duration(segment: Segment): number {
  return (segment.end - segment.start) / 1000;
}
