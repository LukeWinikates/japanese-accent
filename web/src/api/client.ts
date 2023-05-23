import {AxiosInstance, AxiosResponse} from "axios";
import {Waveform} from "./types";

interface WaveformClient {
  GET: (videoUuid: string, sampleRate: number) =>
    Promise<AxiosResponse<Waveform, any>>
}

export interface ApiClient {
  waveform: WaveformClient
}

export function NewApiClient(axios: AxiosInstance): ApiClient {
  return {
    waveform: waveformClient(axios),
    // export: exportClient(axios),
    // video: videoClient(axios),
  };
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