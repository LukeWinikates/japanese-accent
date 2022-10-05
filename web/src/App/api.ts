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
  startMS: number,
  endMS: number,
  text: string,
  uuid: string,
  videoUuid: string,
  lastActivityAt: Date
  pitch: Pitch
};

export declare type DraftSegment = {
  startMS: number,
  endMS: number,
  text: string,
  uuid: string
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
  return (segment.endMS - segment.startMS) / 1000;
}

export type Audio = {
  id: string,
  url: string,
  speakerUsername: string,
  speakerGender: string,
  wordId: number,
};

export type WordAnalysis = {
  wordId: number,
  pattern: string,
  morae: string,
  audio: [Audio],
}

export type AppSettings = {
  forvoApiKey: string,
  audioExportPath: string,
}

export type Export = {
  id: string,
  progress: string,
  done: boolean,
}

export type Waveform = {
  samples: number[],
  sampleRate: number
}

export type Timing = {
  timeMS: number,
  labels: string[],
}

export type VideoAdvice = {
  suggestedSegments: DraftSegment[],
  timings: Timing[]
}

export type VideoDraft = {
  draftSegments: DraftSegment[]
}

export type BoostPostBody = {
  segmentId: string
}

export type ActivityPostBody = {
  segmentId: string
}

