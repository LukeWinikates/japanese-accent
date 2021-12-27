export declare type Category = {
  name: string,
  categories: Category[],
}

export declare type Word = {
  id: string,
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
  words: Word[],
  videoStatus: VideoStatus
  lastActivityAt: string
  text: string,
  files: Files
}

export declare type Files = {
  hasMediaFile: boolean,
  hasSubtitleFile: boolean
}

export declare type Pitch = {
  pattern: string
  morae: string
}

export declare type Segment = {
  start: number,
  end: number,
  text: string,
  uuid: string,
  videoUuid: string,
  lastActivityAt: Date
  pitch: Pitch
};

export declare type Highlights = {
  videos: VideoSummary[],
  wordLists: WordList[]
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

export declare type WordList = {
  id: number,
  name: string
  words: Word[]
}

export function duration(segment: Segment): number {
  return (segment.end - segment.start) / 1000;
}

export type Audio = {
  id: string,
  url: string,
  speakerUsername: string,
  speakerGender: string,
};

export type WordAnalysis = {
  wordId: number,
  pattern: string,
  morae: string,
  audio: [Audio],
}

export type AppSettings = {
  forvoApiKey: string,
}

export type VttTimeline = {
  durationSec: number
  segments: VttSegment[],
}

export type VttSegment = {
  start: number,
  end: number,
  text: string,
}