import React, {useEffect, useState} from 'react';
import useFetch from "use-http";

import {Video} from "../../App/api";
import {Loadable} from "../../App/loadable";
import {PendingYouTubeVideo} from "./PendingYouTubeVideo";
import {LoadedYouTubeVideo} from "./LoadedYouTubeVideo";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import {YouTubeVideoEditor} from "./YouTubeVideoEditor";
import {useParams} from "react-router-dom";

export const YoutubeVideoPage = () => {
  const {logError} = useServerInteractionHistory();
  const {id} = useParams();
  const videoId = id;
  const [video, setVideo] = useState<Loadable<Video>>("loading");
  const {get,} = useFetch<Video>(
    '/api/videos/' + videoId);

  const setVideoData = (video: Video) => {
    setVideo({
      data: video
    })
  };

  useEffect(() => {
    get('').then(vr => setVideo({data: vr})).catch(() => logError("could not load video"))
  }, [videoId, get, setVideo, logError]);

  if (video === "loading") {
    return (<>loading...</>);
  }

  if (!video.data.files.hasMediaFile) {
    return (
      <PendingYouTubeVideo video={video.data}/>
    );
  }

  if (video.data.videoStatus !== "Complete") {
    return (
      <YouTubeVideoEditor video={video.data} onVideoChange={setVideoData}/>
    );
  }

  return (
    <LoadedYouTubeVideo video={video.data} onVideoChange={setVideoData}/>
  );
};