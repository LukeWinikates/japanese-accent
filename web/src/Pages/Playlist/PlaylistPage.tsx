import React, {useEffect, useState} from 'react';
import {useRouteMatch} from "react-router";
import {Loadable} from "../../App/loadable";
import {Playlist} from "../../App/api";
import useFetch from "use-http";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import {Typography} from "@mui/material";
import {LoadedPlaylistContent} from "./LoadedPlaylistContent";

export const PlaylistPage = () => {
  const match = useRouteMatch<{ id: string }>();
  const {logError} = useServerInteractionHistory();
  const [playlist, setPlaylist] = useState<Loadable<Playlist>>("loading");

  let playlistId = match.params.id;
  const {get, response, error} = useFetch('/api/playlists/' + playlistId);

  const setData = (playlist: Playlist) => {
    setPlaylist({
      data: playlist
    })
  };

  async function initialize() {
    const videoResponse = await get('');
    if (response.ok) {
      setData(videoResponse);
      return videoResponse
    } else {
      logError("could not load playlist: " + error);
    }
  }

  useEffect(() => {
    initialize();
  }, [playlistId]);

  return (
    <>
      <Typography>
        Playlist: {playlistId}
      </Typography>
      {(playlist !== 'loading') && <LoadedPlaylistContent playlist={playlist.data} onPlaylistChange={setData}/>}
    </>
  );
}