import React, {useCallback} from 'react';
import {Video} from "../../api/types";
import {PendingYouTubeVideo} from "./PendingYouTubeVideo";
import {LoadedYouTubeVideo} from "./LoadedYouTubeVideo";
import {useParams} from "react-router-dom";
import {useBackendAPI} from "../../App/useBackendAPI";
import {Loader, Settable} from "../../App/Loader";

function Loaded({value, setValue}: Settable<Video>) {
  if (!value.files.hasMediaFile) {
    return (
      <PendingYouTubeVideo video={value}/>
    );
  }

  return (
    <LoadedYouTubeVideo video={value} onVideoChange={setValue}/>
  );
}

type PageParams = { id: string };

export const YoutubeVideoPage = () => {
  const {id} = useParams<PageParams>() as PageParams;
  const api = useBackendAPI();

  const callback = useCallback(() => {
    return api.videos.GET(id)
  }, [id, api.videos])

  return (
    <Loader callback={callback}
            into={Loaded}/>
  )
};