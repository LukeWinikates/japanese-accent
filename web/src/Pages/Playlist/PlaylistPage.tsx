import React, {useEffect, useState} from 'react';
import {Loadable} from "../../App/loadable";
import {Playlist} from "../../App/api";
import useFetch from "use-http";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import {Typography} from "@mui/material";
import {LoadedPlaylistContent} from "./LoadedPlaylistContent";
import {useParams} from "react-router-dom";

export const PlaylistPage = () => {
  const {id} = useParams();
  const {logError} = useServerInteractionHistory();
  const [playlist, setPlaylist] = useState<Loadable<Playlist>>("loading");

  let playlistId = id;
  const {get} = useFetch('/api/playlists/' + playlistId);

  const setData = (playlist: Playlist) => {
    setPlaylist({
      data: playlist
    })
  };

  useEffect(() => {
    get('').then(v => setPlaylist({data: v})).catch(() => logError("could not load playlist"));
  }, [playlistId, setPlaylist, logError, get]);

  return (
    <>
      <Typography>
        Playlist: {playlistId}
      </Typography>
      {(playlist !== 'loading') && <LoadedPlaylistContent playlist={playlist.data} onPlaylistChange={setData}/>}
    </>
  );
}