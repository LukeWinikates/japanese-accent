import React, {useEffect, useState} from 'react';
import {useRouteMatch} from "react-router";
import {Loadable} from "../loadable";
import {Playlist, VideoSummary} from "../api";
import useFetch from "use-http";
import {useEventHistory} from "../Status/GlobalStatus";
import {Typography} from "@material-ui/core";
import {LoadedPlaylistContent} from "./LoadedPlaylistContent";

export const PlaylistPage = () => {
  const match = useRouteMatch<{ id: string }>();
  const {logEvent} = useEventHistory();
  const [playlist, setPlaylist] = useState<Loadable<Playlist>>("loading");


  let playlistId = match.params.id;
  const {get, response, error} = useFetch<VideoSummary>(
    '/api/playlists/' + playlistId);

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
      logEvent({text: "could not load playlist: " + error})
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