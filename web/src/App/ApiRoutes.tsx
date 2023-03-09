import axios from "axios";
import {
  ActivityPostBody,
  AppSettings,
  BoostPostBody,
  Export,
  Highlights,
  Pitch,
  Playlist,
  Segment,
  SegmentCreateBody,
  SegmentPutBody,
  Video,
  VideoAdvice,
  VideoSummary,
  Waveform as ApiWaveform,
  WordAnalysis,
  WordList
} from "./api";

export function waveformGET(videoUuid: string, sampleRate: number = 800) {
  return axios.get<ApiWaveform>('/api/videos/' + videoUuid + '/waveform', {params: {sample_rate: sampleRate}});
}

export function exportGET(parentId: string) {
  return axios.get<Export>("/api/exports/" + parentId);
}

export function activityPOST(activityPostBody: ActivityPostBody) {
  return axios.post("/api/activity", {
    ...activityPostBody,
    activityType: "PracticeStart"
  });
}

export function boostPOST(boostPostBody: BoostPostBody) {
  return axios.post("/api/boosts", {
      ...boostPostBody
    }
  );
}

export function wordAnalysisGET(word: string) {
  return axios.get<WordAnalysis>('/api/word-analysis/' + word);
}

export function pitchPOST(segment: Segment) {
  return axios.post<Pitch>(`/api/segments/${segment.uuid}/pitches`);
}

export function segmentDELETE(segment: Segment) {
  return axios.delete('/api/videos/' + segment.videoUuid + "/segments/" + segment.uuid);
}

export function exportsPOST(parentId: string) {
  return axios.post<Export>("/api/exports/", {
    videoUuid: parentId
  });
}

export function applicationSettingsGET() {
  return axios.get<AppSettings>("api/application-settings");
}

export function applicationSettingsPUT(data: {
  forvoApiKey: string
} | { audioExportPath: string }) {
  return axios.put("api/application-settings", data);
}

export function debugRefreshMetricsPOST() {
  return axios.post("api/debug/refresh-metrics");
}

export function playlistPOST() {
  return axios.post<Playlist>("/api/playlists", {
    count: 20
  });
}

export function highlightsGET() {
  return axios.get<Highlights>("/api/highlights");
}

export function videoPOST(data: { youtubeId: string, title: string }) {
  return axios.post("api/videos", data);
}

export function playlistGET(playlistId: string | undefined) {
  return axios.get<Playlist>('/api/playlists/' + playlistId);
}

export function videoSummariesGET() {
  return axios.get<VideoSummary[]>(
    "/api/videos");
}

export function wordAnalysisPOST(data: { text: string }) {
  return axios.post('/api/word-analysis/', data);
}

export function videoWordLinkPOST(data: { videoId: string; word: string }) {
  return axios.post('/api/video-word-links', data);
}

export function wordListGET(id: string | undefined) {
  return axios.get<WordList>('/api/wordlists/' + id);
}

export function videoAdviceGET(videoId: string) {
  return axios.get<VideoAdvice>('/api/videos/' + videoId + '/advice');
}

export function videoSegmentPOST(videoId: string, data: SegmentCreateBody) {
  return axios.post<Segment>('/api/videos/' + videoId + "/segments/", data);
}

export function wordListsGET() {
  return axios.get<WordList[]>("/api/wordlists");
}

export function videoGET(videoId: string | undefined) {
  return axios.get<Video>('/api/videos/' + videoId);
}

export function videoSegmentPUT(videoId: string, segment: SegmentPutBody) {
  return axios.put('/api/videos/' + videoId + "/segments/" + segment.uuid, segment);
}

export function videoSegmentDELETE(videoId: string, segment: Segment) {
  return axios.delete('/api/videos/' + videoId + "/segments/" + segment.uuid);
}

export function suggestedSegmentsDELETE(videoId: string, segmentId: string) {
  return axios.delete('/api/videos/' + videoId + "/advice/segments/" + segmentId)
}