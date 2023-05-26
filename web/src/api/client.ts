import {AxiosInstance, AxiosResponse} from "axios";
import {AppSettings, AppSettingsPUTBody, Highlights, Waveform} from "./types";

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

export interface ApiClient {
  waveform: WaveformClient
  settings: SettingsClient
  highlights: HighlightsClient
}

export function NewApiClient(axios: AxiosInstance): ApiClient {
  return {
    waveform: waveformClient(axios),
    settings: settingsClient(axios),
    highlights: highlightsClient(axios)
    // export: exportClient(axios),
    // video: videoClient(axios),
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