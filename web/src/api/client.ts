import {AxiosInstance, AxiosResponse} from "axios";
import {
  AppSettings,
  AppSettingsPUTBody, ClipsPostBody, ClipsPutBody,
  Export,
  Highlights,
  Playlist,
  PlaylistPostBody, Segment,
  Video,
  VideoAdvice,
  VideoPostBody,
  VideoSummary,
  Waveform,
  WordAnalysis,
  WordAnalysisPostBody,
  WordList,
  WordLinksPostBody, Pitch, ActivityPostBody, BoostPostBody
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


interface WordLinksClient {
  POST: (data: WordLinksPostBody) => Promise<AxiosResponse<void, any>>
}

interface VideosClient {
  index: {
    GET: () => Promise<AxiosResponse<VideoSummary[], any>>
  }
  GET: (videoId: string) => Promise<AxiosResponse<Video, any>>
  POST: (body: VideoPostBody) => Promise<AxiosResponse<Video, any>>
  advice: AdviceClient
  clips: ClipsClient
  wordLinks: WordLinksClient
}

interface ClipsClient {
  PUT: (videoId: string, data: ClipsPutBody) => Promise<AxiosResponse<Segment, any>>
  POST: (videoId: string, data: ClipsPostBody) => Promise<AxiosResponse<Segment, any>>
  DELETE: (videoId: string, clipId: string) => Promise<AxiosResponse<void, any>>
  pitch: {
    POST: (clipId: string) => Promise<AxiosResponse<Pitch, any>>
  }
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

interface ActivityClient {
  POST:(data: ActivityPostBody) => Promise<AxiosResponse<void, any>>
}

interface BoostsClient {
  POST: (data: BoostPostBody) => Promise<AxiosResponse<void, any>>
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
  activity: ActivityClient
  boosts: BoostsClient
}

function activityClient(axios: AxiosInstance): ActivityClient {
  return {
    POST: (data: ActivityPostBody) => {
      return axios.post("/api/activity", {
        ...data,
        activityType: "PracticeStart"
      })
    }
  };
}

function boostsClient(axios: AxiosInstance) : BoostsClient {
  return {
    POST: data => {
      return axios.post("/api/boosts", {
        ...data
      })
    }
  };
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
    playlists: playlistClient(axios),
    activity: activityClient(axios),
    boosts: boostsClient(axios)
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

function wordLinksClient(axios: AxiosInstance) : WordLinksClient {
  return {
    POST: (data: WordLinksPostBody) =>  {
      return axios.post('/api/video-word-links', data)
    }
  };
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
    advice: adviceClient(axios),
    clips: clipsClient(axios),
    wordLinks: wordLinksClient(axios)
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

function clipsClient(axios: AxiosInstance): ClipsClient {
  return {
    pitch: {
      POST: function (clipId: string) {
        return axios.post<Pitch>(`/api/segments/${clipId}/pitches`);
      }
    },
    DELETE: (videoId: string, clipId: string) => {
        return axios.delete('/api/videos/' + videoId + "/segments/" + clipId)
    },
    POST: (videoId: string, data: ClipsPostBody) => {
      return axios.post<Segment>('/api/videos/' + videoId + "/segments/", data)
    },
    PUT: (videoId: string, data: ClipsPutBody) => {
      return axios.put('/api/videos/' + videoId + "/segments/" + data.uuid, data)
    }
  }
}

