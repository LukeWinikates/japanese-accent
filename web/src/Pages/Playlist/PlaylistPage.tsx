import React, {useEffect, useState} from 'react';
import {Loadable} from "../../App/loadable";
import {Playlist} from "../../api/types";
import {Typography} from "@mui/material";
import {LoadedPlaylistContent} from "./LoadedPlaylistContent";
import {useParams} from "react-router-dom";
import {playlistGET} from "../../api/ApiRoutes";

export const PlaylistPage = () => {
  const {id} = useParams();
  const [playlist, setPlaylist] = useState<Loadable<Playlist>>("loading");
  let playlistId = id;

  const setData = (playlist: Playlist) => {
    setPlaylist({
      data: playlist
    })
  };

  useEffect(() => {
    playlistGET(playlistId)
      .then(r => setPlaylist({data: r.data}));
  }, [playlistId, setPlaylist]);

  return (
    <>
      <Typography>
        Playlist: {playlistId}
      </Typography>
      {(playlist !== 'loading') && <LoadedPlaylistContent playlist={playlist.data} onPlaylistChange={setData}/>}
    </>
  );
}