import React, {useEffect, useState} from 'react';
import useFetch from "use-http";

import {Video, VideoSummary} from "../api";
import {useRouteMatch} from "react-router";
import {match} from "react-router/ts4.0";
import {Loadable} from "../loadable";
import {PendingYouTubeVideo} from "./PendingYouTubeVideo";
import {LoadedYouTubeVideo} from "./LoadedYouTubeVideo";

type YoutubeVideoPageParams = string[];

function parseRouteSegments(match: match<YoutubeVideoPageParams>) {
  const urlSegments = match.params[0].split("/");
  const videoId = urlSegments[urlSegments.length - 2];
  const title = urlSegments[urlSegments.length - 1];
  return {
    videoId,
    title
  };
}

export const YoutubeVideoPage = () => {
  const match = useRouteMatch<YoutubeVideoPageParams>();
  const {
    videoId
  } = parseRouteSegments(match);

  const [video, setVideo] = useState<Loadable<Video>>("loading");

  const {get, response} = useFetch<VideoSummary>(
    '/api/videos/' + videoId);

  const setVideoData = (video: Video) => {
    setVideo({
      data: video
    })
  };

  async function initialize() {
    const videoResponse = await get('');
    if (response.ok) {
      setVideoData(videoResponse);
      return videoResponse
    }
  }

  useEffect(() => {
    initialize();
  }, [videoId]);

  if (video === "loading") {
    return (<>loading...</>);
  }

  if (video.data.videoStatus === "Pending") {
    return (
      <PendingYouTubeVideo video={video.data}/>
    );
  }

  return (
    <LoadedYouTubeVideo video={video.data} onVideoChange={setVideoData}/>
  );
};