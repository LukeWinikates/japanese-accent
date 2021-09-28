import {Box, Breadcrumbs, Container, Typography} from "@material-ui/core";
import React from "react";
import {Playlist, Segment} from "../App/api";
import {PlaylistPlayer} from "./PlaylistPlayer";

export const LoadedPlaylistContent = ({
                                        playlist,
                                        onPlaylistChange
                                      }: { playlist: Playlist, onPlaylistChange: (p: Playlist) => void }) => {

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