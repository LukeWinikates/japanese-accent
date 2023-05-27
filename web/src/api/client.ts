import {AxiosInstance, AxiosResponse} from "axios";
import {
  AppSettings,
  AppSettingsPUTBody,
  Export,
  Highlights,
  Playlist,
  PlaylistPostBody,
  Video,
  VideoAdvice,
  VideoPostBody,
  VideoSummary,
  Waveform,
  WordAnalysis,
  WordAnalysisPostBody,
  WordList
} from "./types";

interface WaveformClient {
  GET: (videoUuid: string, sampleRate: number) =>
    Promise<AxiosResponse<Waveform, any>>
}

interface HighlightsClient {
  GET: () => Promise<AxiosResponse<Highlights, any>>
}

interface SettingsClient {
  GET: () => Promise<AxiosResponse<AppSettings, any>>
  PUT: (data: AppSettingsPUTBody) => Promise<AxiosResponse<AppSettings, any>>
}

interface ExportsClient {
  GET: (parentId: string) => Promise<AxiosResponse<Export, any>>
  POST: (videoUUID: string) => Promise<AxiosResponse<Export, any>>
}

interface VideosClient {
  index: {
    GET: () => Promise<AxiosResponse<VideoSummary[], any>>
  }
  GET: (videoId: string) => Promise<AxiosResponse<Video, any>>
  POST: (body: VideoPostBody) => Promise<AxiosResponse<Video, any>>
  advice: AdviceClient
}

interface WordListsClient {
  index: {
    GET: () => Promise<AxiosResponse<WordList[], any>>
  }
  GET: (videoId: string) => Promise<AxiosResponse<WordList, any>>
}

interface DebugClient {
  refreshMetrics: {
    POST: () => Promise<AxiosResponse<any, any>>
  }
}

interface WordAnalysisClient {
  GET: (word: string) => Promise<AxiosResponse<WordAnalysis, any>>
  POST: (data: WordAnalysisPostBody) => Promise<AxiosResponse<WordAnalysis, any>>
}

interface AdviceClient {
  GET: (videoId: string) => Promise<AxiosResponse<VideoAdvice, any>>
  suggestedClips: {
    DELETE: (videoId: string, segmentUUID: string) => Promise<AxiosResponse<void, any>>
  }
}

interface PlaylistClient {
  GET: (playlistId: string) => Promise<AxiosResponse<Playlist, any>>
  POST: (data: PlaylistPostBody) => Promise<AxiosResponse<Playlist, any>>
}

export interface ApiClient {
  debug: DebugClient
  waveform: WaveformClient
  settings: SettingsClient
  highlights: HighlightsClient
  exports: ExportsClient
  videos: VideosClient
  wordLists: WordListsClient
  wordAnalysis: WordAnalysisClient
  playlists: PlaylistClient
}

export function NewApiClient(axios: AxiosInstance): ApiClient {
  return {
    waveform: waveformClient(axios),
    settings: settingsClient(axios),
    highlights: highlightsClient(axios),
    exports: exportsClient(axios),
    videos: videosClient(axios),
    wordLists: wordListsClient(axios),
    debug: debugClient(axios),
    wordAnalysis: wordAnalysisClient(axios),
    playlists: playlistClient(axios)
  };
}

function settingsClient(axios: AxiosInstance): SettingsClient {
  return {
    GET: () => {
      return axios.get<AppSettings>("api/application-settings");
    },
    PUT: (data: AppSettingsPUTBody) => {
      return axios.put("api/application-settings", data);
    }
  }
}

function waveformClient(axios: AxiosInstance): WaveformClient {
  return {
    GET: (videoUuid: string, sampleRate: number = 800) => {
      return axios.get<Waveform>(
        '/api/videos/' + videoUuid + '/waveform',
        {params: {sample_rate: sampleRate}});
    },
  }
}

function highlightsClient(axios: AxiosInstance): HighlightsClient {
  return {
    GET: () => {
      return axios.get<Highlights>("/api/highlights");
    }
  }
}

function exportsClient(axios: AxiosInstance): ExportsClient {
  return {
    GET: (parentId: string) => {
      return axios.get<Export>("/api/exports/" + parentId);
    },
    POST: (parentId: string) => {
      return axios.post<Export>("/api/exports/", {
        videoUuid: parentId
      });
    }
  }
}

function adviceClient(axios: AxiosInstance): AdviceClient {
  return {
    GET: (videoId: string) => {
      return axios.get<VideoAdvice>('/api/videos/' + videoId + '/advice');
    },
    suggestedClips: {
      DELETE: (videoId: string, clipUUID: string) => {
        return axios.delete('/api/videos/' + videoId + "/advice/clips/" + clipUUID);
      }
    }
  }
}

function videosClient(axios: AxiosInstance): VideosClient {
  return {
    index: {
      GET: () => {
        return axios.get<VideoSummary[]>("/api/videos");
      }
    },
    GET: (videoId: string) => {
      return axios.get<Video>('/api/videos/' + videoId);
    },
    POST: (body) => {
      return axios.post("/api/videos", body);
    },
    advice: adviceClient(axios)
  }
}

function wordListsClient(axios: AxiosInstance): WordListsClient {
  return {
    index: {
      GET: () => {
        return axios.get<WordList[]>("/api/wordlists");
      }
    },
    GET: (id: string) => {
      return axios.get<WordList>('/api/wordlists/' + id);
    }
  }
}

function debugClient(axios: AxiosInstance): DebugClient {
  return {
    refreshMetrics: {
      POST: () => {
        return axios.post("/api/debug/refresh-metrics");
      }
    }
  }
}

function wordAnalysisClient(axios: AxiosInstance): WordAnalysisClient {
  return {
    GET: (word: string) => {
      return axios.get<WordAnalysis>('/api/word-analysis/' + word);
    },
    POST: (data: WordAnalysisPostBody) => {
      return axios.post<WordAnalysis>('/api/word-analysis/', data);
    }
  }
}

function playlistClient(axios: AxiosInstance): PlaylistClient {
  return {
    GET: (playlistId: string) => {
      return axios.get<Playlist>('/api/playlists/' + playlistId);
    }, POST: (data: PlaylistPostBody) => {
      return axios.post<Playlist>("/api/playlists", data);
    }
  }
}