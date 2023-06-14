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
  clips: Clip[],
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

export declare interface Clip extends BasicClip {
  lastActivityAt: Date
  parent: string | null
  pitch: Pitch
}

export declare type BasicClip = {
  startMS: number,
  endMS: number,
  text: string,
  uuid: string,
  videoUuid: string,
  labels: ClipLabel[],
};

export type ClipLabel = "SAVED" | "ADVICE" | "MUTED"

export declare type Highlights = {
  videos: VideoSummary[],
  wordLists: WordList[]
}

export declare type Playlist = {
  id: string,
  title: string,
  segments: Clip[],
}

export declare type WordList = {
  id: number,
  name: string
  words: Word[]
}

export function durationSeconds(clip: Clip): number {
  return (clip.endMS - clip.startMS) / 1000;
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
  suggestedClips: BasicClip[],
}

export type BoostPostBody = {
  segmentId: string
}

export type ActivityPostBody = {
  segmentId: string
}

export type ClipsPostBody = {
  videoUuid: string;
  startMS: number;
  endMS: number;
  text: string
  parent?: string | null,
  labels: string[]
};

export type ClipsPutBody = {
  uuid: string;
  videoUuid: string;
  startMS: number;
  endMS: number;
  text: string
  parent?: string | null,
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

export type WordLinksPostBody = { videoId: string, word: string };
