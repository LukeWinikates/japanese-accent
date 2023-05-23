import React, {useEffect, useState} from 'react';
import {Video} from "../../api/types";
import {Loadable} from "../../App/loadable";
import {useServerInteractionHistory} from "../../App/useServerInteractionHistory";
import {YouTubeVideoEditor} from "./YouTubeVideoEditor";
import {useParams} from "react-router-dom";
import {videoGET} from "../../api/ApiRoutes";

export const VideoClipsEditPage = () => {
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
  }, [videoId, setVideo, logError]);

  if (video === "loading") {
    return (<>loading...</>);
  }

  if (!video.data.files.hasMediaFile) {
    throw new Error("invalid condition")
  }

  return (<YouTubeVideoEditor video={video.data} onVideoChange={setVideoData}/>);

};