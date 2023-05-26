import {AxiosInstance, AxiosResponse} from "axios";
import {
  AppSettings,
  AppSettingsPUTBody,
  Export,
  Highlights,
  Video,
  VideoPostBody,
  VideoSummary,
  Waveform,
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
}
interface WordListsClient {
  index: {
    GET: () => Promise<AxiosResponse<WordList[], any>>
  }
  GET: (videoId: string) => Promise<AxiosResponse<WordList, any>>
}

export interface ApiClient {
  waveform: WaveformClient
  settings: SettingsClient
  highlights: HighlightsClient
  exports: ExportsClient
  videos: VideosClient
  wordLists: WordListsClient
}

export function NewApiClient(axios: AxiosInstance): ApiClient {
  return {
    waveform: waveformClient(axios),
    settings: settingsClient(axios),
    highlights: highlightsClient(axios),
    exports: exportsClient(axios),
    videos: videosClient(axios),
    wordLists: wordListsClient(axios),
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
      return axios.post("api/videos", body);
    }
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
