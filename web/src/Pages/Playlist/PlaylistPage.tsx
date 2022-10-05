import React, {useEffect, useState} from 'react';
import {Loadable} from "../../App/loadable";
import {Playlist} from "../../App/api";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import {Typography} from "@mui/material";
import {LoadedPlaylistContent} from "./LoadedPlaylistContent";
import {useParams} from "react-router-dom";
import {playlistGET} from "../../App/ApiRoutes";

export const PlaylistPage = () => {
  const {id} = useParams();
  const {logError} = useServerInteractionHistory();
  const [playlist, setPlaylist] = useState<Loadable<Playlist>>("loading");
  let playlistId = id;

  const setData = (playlist: Playlist) => {
    setPlaylist({
      data: playlist
    })
  };

  useEffect(() => {
    playlistGET(playlistId)
      .then(r => setPlaylist({data: r.data}))
      .catch(() => logError("could not load playlist"));
  }, [playlistId, setPlaylist, logError]);

  return (
    <>
      <Typography>
        Playlist: {playlistId}
      </Typography>
      {(playlist !== 'loading') && <LoadedPlaylistContent playlist={playlist.data} onPlaylistChange={setData}/>}
    </>
  );
}