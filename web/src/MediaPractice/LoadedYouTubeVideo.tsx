import {Segment, Video} from "../api";
import React from "react";
import {Box, Breadcrumbs, Button, Container, Typography} from "@material-ui/core";
import YouTubeIcon from '@material-ui/icons/YouTube';
import LaunchIcon from '@material-ui/icons/Launch';
import {PlaylistPlayer} from "../Playlist/PlaylistPlayer";

export const LoadedYouTubeVideo = ({video, onVideoChange}: { video: Video, onVideoChange: (v: Video) => void }) => {
  function setVideoSegments(newSegments: Segment[]) {
    onVideoChange({
      ...video,
      segments: newSegments
    });
  }

  return (
    <Box m={2}>
      <Container maxWidth='lg'>
        <Breadcrumbs aria-label="breadcrumb">
        </Breadcrumbs>

        <Box paddingY={2} margin={0}>
          <Typography variant="h2">
            {video.title}
          </Typography>
          <Button href={video.url} color="secondary" target="_blank"
                  startIcon={<YouTubeIcon/>} variant="text"
                  endIcon={<LaunchIcon fontSize="small"/>}>
            Open in YouTube
          </Button>
        </Box>

        <PlaylistPlayer segments={video.segments} onSegmentsChange={setVideoSegments}/>
      </Container>
    </Box>
  );
};