import React, {useCallback} from 'react';
import {Playlist} from "../../api/types";
import {Typography} from "@mui/material";
import {LoadedPlaylistContent} from "./LoadedPlaylistContent";
import {useParams} from "react-router-dom";
import {useBackendAPI} from "../../App/useBackendAPI";
import {Loader, Settable} from "../../App/Loader";

type PageParams = { id: string };

const LoadedPage = ({value, setValue}: Settable<Playlist>) => {
  return (
    <>
      <Typography>
        Playlist: {value.id}
      </Typography>
      <LoadedPlaylistContent
        playlist={value}
        onPlaylistChange={setValue}/>
    </>
  );
}

export const PlaylistPage = () => {
  const {id} = useParams<PageParams>() as PageParams;
  const api = useBackendAPI();
  let callback = useCallback(() => api.playlists.GET(id),
    [api.playlists, id]);

  return (
    <Loader callback={callback} into={LoadedPage}/>
  );
}