import axios from "axios";
import {ActivityPostBody, BoostPostBody, Pitch, Segment} from "./types";

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

export function videoWordLinkPOST(data: { videoId: string; word: string }) {
  return axios.post('/api/video-word-links', data);
}
