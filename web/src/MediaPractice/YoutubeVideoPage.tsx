import React, {useEffect, useState} from 'react';
import useFetch from "use-http";

import {Video, VideoSummary} from "../App/api";
import {useRouteMatch} from "react-router";
import {Loadable} from "../App/loadable";
import {PendingYouTubeVideo} from "./PendingYouTubeVideo";
import {LoadedYouTubeVideo} from "./LoadedYouTubeVideo";

export const YoutubeVideoPage = () => {
  const match = useRouteMatch<{ id: string }>();
  const videoId = match.params.id;

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