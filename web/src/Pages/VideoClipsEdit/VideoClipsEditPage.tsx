import React, {useCallback} from 'react';
import {YouTubeVideoEditor} from "./YouTubeVideoEditor";
import {useParams} from "react-router-dom";
import {useBackendAPI} from "../../App/useBackendAPI";
import {Loader} from "../../App/Loader";
import {Video} from "../../api/types";

const Into = ({value, setValue}: { value: Video, setValue: (value: Video) => void }) => {
  return <YouTubeVideoEditor video={value} onVideoChange={setValue}/>
}

type PageParams = { id: string };

export const VideoClipsEditPage = () => {
  const {id} = useParams<PageParams>() as PageParams;
  const api = useBackendAPI();
  let callback = useCallback(() => api.videos.GET(id),
    [api.videos, id]);

  return (
    <Loader callback={callback} into={Into}/>
  );
};
