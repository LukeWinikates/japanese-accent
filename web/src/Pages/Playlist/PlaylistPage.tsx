import React, {useEffect, useState} from 'react';
import {Loadable} from "../../App/loadable";
import {Playlist} from "../../api/types";
import {Typography} from "@mui/material";
import {LoadedPlaylistContent} from "./LoadedPlaylistContent";
import {useParams} from "react-router-dom";
import {useBackendAPI} from "../../App/useBackendAPI";

export const PlaylistPage = () => {
  const {id} = useParams();
  const api = useBackendAPI();
  const [playlist, setPlaylist] = useState<Loadable<Playlist>>("loading");
  let playlistId = id;

  const setData = (playlist: Playlist) => {
    setPlaylist({
      data: playlist
    })
  };

  useEffect(() => {
    playlistId && api.playlists.GET(playlistId)
      .then(r => setPlaylist({data: r.data}));
  }, [playlistId, setPlaylist, api.playlists]);

  return (
    <>
      <Typography>
        Playlist: {playlistId}
      </Typography>
      {(playlist !== 'loading') && <LoadedPlaylistContent playlist={playlist.data} onPlaylistChange={setData}/>}
    </>
  );
}