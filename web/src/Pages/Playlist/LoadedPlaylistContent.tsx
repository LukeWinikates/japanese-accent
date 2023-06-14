import {Box, Breadcrumbs, Container, Typography} from "@mui/material";
import React, {useCallback} from "react";
import {Clip, Playlist} from "../../api/types";
import {PlaylistPlayer} from "../../Dictaphone/PlaylistPlayer";

type Props = { playlist: Playlist, onPlaylistChange: (p: Playlist) => void };

export const LoadedPlaylistContent = ({playlist, onPlaylistChange}: Props) => {
  const setSegments = useCallback((clips: Clip[]) => {
    onPlaylistChange({
      ...playlist,
      clips
    })
  }, [onPlaylistChange, playlist]);

  return (
    <Box m={2}>
      <Container maxWidth='lg'>
        <Breadcrumbs aria-label="breadcrumb">
        </Breadcrumbs>

        <Box paddingY={2} margin={0}>
          <Typography variant="h2">
            {playlist.title}
          </Typography>

        </Box>
      </Container>

      <PlaylistPlayer parentId={playlist.id} segments={playlist.clips} onSegmentsChange={setSegments}/>
    </Box>
  );
}