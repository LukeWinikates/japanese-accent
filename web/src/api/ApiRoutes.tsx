import axios from "axios";
import {ActivityPostBody, BoostPostBody, Pitch, Segment, SegmentCreateBody, SegmentPutBody,} from "./types";

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

export function pitchPOST(segment: Segment) {
  return axios.post<Pitch>(`/api/segments/${segment.uuid}/pitches`);
}

export function segmentDELETE(segment: Segment) {
  return axios.delete('/api/videos/' + segment.videoUuid + "/segments/" + segment.uuid);
}

export function videoWordLinkPOST(data: { videoId: string; word: string }) {
  return axios.post('/api/video-word-links', data);
}

export function videoSegmentPOST(videoId: string, data: SegmentCreateBody) {
  return axios.post<Segment>('/api/videos/' + videoId + "/segments/", data);
}

export function videoSegmentPUT(videoId: string, segment: SegmentPutBody) {
  return axios.put('/api/videos/' + videoId + "/segments/" + segment.uuid, segment);
}

export function videoSegmentDELETE(videoId: string, segment: Segment) {
  return axios.delete('/api/videos/' + videoId + "/segments/" + segment.uuid);
}
