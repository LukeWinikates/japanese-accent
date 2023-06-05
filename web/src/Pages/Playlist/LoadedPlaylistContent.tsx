import {Box, Breadcrumbs, Container, Typography} from "@mui/material";
import React from "react";
import {Playlist, Segment} from "../../api/types";
import {PlaylistPlayer} from "../../Dictaphone/PlaylistPlayer";

type Props = { playlist: Playlist, onPlaylistChange: (p: Playlist) => void };
export const LoadedPlaylistContent = ({playlist, onPlaylistChange}: Props) => {
  function setSegments(segments: Segment[]) {
    onPlaylistChange({
      ...playlist,
      segments
    })
  }

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

      <PlaylistPlayer parentId={playlist.id} segments={playlist.segments} onSegmentsChange={setSegments}/>
    </Box>
  );
}