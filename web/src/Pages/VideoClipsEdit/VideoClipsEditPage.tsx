import React, {useEffect, useState} from 'react';
import {Video} from "../../api/types";
import {Loadable} from "../../App/loadable";
import {YouTubeVideoEditor} from "./YouTubeVideoEditor";
import {useParams} from "react-router-dom";
import {useBackendAPI} from "../../App/useBackendAPI";

export const VideoClipsEditPage = () => {
  const {id} = useParams();
  const videoId = id;
  const [video, setVideo] = useState<Loadable<Video>>("loading");
  const api = useBackendAPI();

  const setVideoData = (video: Video) => {
    setVideo({
      data: video
    })
  };

  useEffect(() => {
    videoId && api.videos.GET(videoId)
      .then(r => setVideo({data: r.data}))
  }, [videoId, setVideo, api.videos]);

  if (video === "loading") {
    return (<>loading...</>);
  }

  if (!video.data.files.hasMediaFile) {
    throw new Error("invalid condition")
  }

  return (<YouTubeVideoEditor video={video.data} onVideoChange={setVideoData}/>);

};