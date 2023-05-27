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
  lastActivityAt: string
}

export declare type Video = {
  title: string,
  url: string,
  videoId: string,
  segments: Segment[],
  words: Word[],
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
  labels: SegmentLabel[],
  parent: string | null
};

export declare type SuggestedSegment = {
  startMS: number,
  endMS: number,
  text: string,
  uuid: string,
  videoUuid: string,
  labels: SegmentLabel[],
};

export type SegmentLabel = "SEGMENT" | "ADVICE" | "MUTED"

export declare type Highlights = {
  videos: VideoSummary[],
  wordLists: WordList[]
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

export type VideoAdvice = {
  suggestedSegments: SuggestedSegment[],
}

export type BoostPostBody = {
  segmentId: string
}

export type ActivityPostBody = {
  segmentId: string
}

export type SegmentCreateBody = {
  videoUuid: string;
  startMS: number;
  endMS: number;
  text: string
  parent: string | null,
  labels: string[]
};
export type SegmentPutBody = {
  uuid: string;
  videoUuid: string;
  startMS: number;
  endMS: number;
  text: string
  parent: string | null,
  labels: string[]
};

export type AppSettingsPUTBody = {
  forvoApiKey: string
} | { audioExportPath: string };

export type VideoPostBody = {
  youtubeId: string,
  title: string
};

export type WordAnalysisPostBody = {
  text: string
}

export type PlaylistPostBody = {
  count: number
}