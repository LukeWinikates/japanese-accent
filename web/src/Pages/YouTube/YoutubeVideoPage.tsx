import React, {useEffect, useState} from 'react';
import {Video} from "../../api/types";
import {Loadable} from "../../App/loadable";
import {PendingYouTubeVideo} from "./PendingYouTubeVideo";
import {LoadedYouTubeVideo} from "./LoadedYouTubeVideo";
import {useServerInteractionHistory} from "../../App/useServerInteractionHistory";
import {useParams} from "react-router-dom";
import {videoGET} from "../../api/ApiRoutes";

export const YoutubeVideoPage = () => {
  const {logError} = useServerInteractionHistory();
  const {id} = useParams();
  const videoId = id;
  const [video, setVideo] = useState<Loadable<Video>>("loading");

  const setVideoData = (video: Video) => {
    setVideo({
      data: video
    })
  };

  useEffect(() => {
    videoGET(videoId)

      .then(r => setVideo({data: r.data}))
      .catch(() => logError("could not load video"))
  }, [videoId,  setVideo, logError]);

  if (video === "loading") {
    return (<>loading...</>);
  }

  if (!video.data.files.hasMediaFile) {
    return (
      <PendingYouTubeVideo video={video.data}/>
    );
  }

  return (
    <LoadedYouTubeVideo video={video.data} onVideoChange={setVideoData}/>
  );
};