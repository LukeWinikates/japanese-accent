import {Clip, Video} from "../../api/types";
import React, {useCallback, useState} from "react";
import {Box, Breadcrumbs, Button, Container, Tab, Tabs, Typography} from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import LaunchIcon from '@mui/icons-material/Launch';
import {PlaylistPlayer} from "../../Dictaphone/PlaylistPlayer";
import {WordListPlayer} from "../../Dictaphone/WordListPlayer";
import {Link} from "react-router-dom";
import VideoIcon from '@mui/icons-material/Theaters';
import EditIcon from '@mui/icons-material/Edit';

type TabTypes = "clips" | "words" | "notes";

type Props = { video: Video, onVideoChange: (v: Video) => void };

export const LoadedYouTubeVideo = ({video, onVideoChange}: Props) => {
  const [activeTab, setActiveTab] = useState<TabTypes>("clips");

  const setVideoSegments = useCallback((newSegments: Clip[]) => {
    onVideoChange({
      ...video,
      clips: newSegments
    });
  }, [onVideoChange, video]);

  const onChange = useCallback((_: React.SyntheticEvent<Element, Event>, value : TabTypes) => {
    setActiveTab(value);
  }, [setActiveTab]);

  return (
    <Box m={2}>
      <Container maxWidth='lg'>
        <Breadcrumbs aria-label="breadcrumb">
        </Breadcrumbs>

        <Box paddingY={2} margin={0}>
          <Typography variant="h2">
            {video.title}
          </Typography>
          <Typography variant="h4">
            Practice Mode
          </Typography>
          <Link to={"./edit"} relative="path">
            <Button startIcon={<VideoIcon/>}
                    endIcon={<EditIcon/>}
            >
              Switch to Clip Editor
            </Button>
          </Link>
          <Button href={video.url} color="secondary" target="_blank"
                  startIcon={<YouTubeIcon/>} variant="text"
                  endIcon={<LaunchIcon fontSize="small"/>}>
            Open in YouTube
          </Button>
        </Box>
        <Tabs
          value={activeTab}
          onChange={onChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Video Clips" value="clips"/>
          <Tab label="Vocabulary" value="words"/>
        </Tabs>
        <Box marginY={2}>
          {
            activeTab === "clips" &&
            <PlaylistPlayer parentId={video.videoId} clips={video.clips} onClipsChange={setVideoSegments}/>
          }
          {
            activeTab === "words" &&
            <WordListPlayer words={video.words}/>
          }
        </Box>
      </Container>
    </Box>
  );
};