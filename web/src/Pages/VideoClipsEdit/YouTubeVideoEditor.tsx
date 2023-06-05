import {SuggestedSegment, Video, VideoAdvice} from "../../api/types";
import React, {useCallback} from "react";
import {Box, Breadcrumbs, Button, Card, CardContent, Container, Typography} from "@mui/material";
import {VideoClipList} from "./VideoClipList";
import {Link} from "react-router-dom";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LaunchIcon from "@mui/icons-material/Launch";
import Mic from "@mui/icons-material/Mic";
import ListenIcon from '@mui/icons-material/Hearing';
import {VideoClipSummary} from "./VideoClipSummary";
import {useBackendAPI} from "../../App/useBackendAPI";
import {Loader} from "../../App/Loader";

function LoadedEditor({
                        video,
                        value,
                        setValue
                      }: { video: Video, value: VideoAdvice, setValue: (value: VideoAdvice) => void }) {
  let muteSuggestion = (segmentToMute: SuggestedSegment) => {
    let newSuggestions = [...value.suggestedSegments];

    newSuggestions.splice(newSuggestions.findIndex(testSegment => testSegment.uuid === segmentToMute.uuid), 1, {
      ...segmentToMute,
      labels: [...segmentToMute.labels, "MUTED"],
    })

    setValue({
      ...value,
      suggestedSegments: newSuggestions
    })
  };

  return (
    <>
      <Box paddingY={2} margin={0}>
        <Typography variant="h2">
          {video.title}
        </Typography>
        <Typography variant="h4">
          Clip Editor
        </Typography>
        <Link to={".."} relative="path">
          <Button startIcon={<Mic/>} endIcon={<ListenIcon/>}>
            Switch to Practice Mode
          </Button>
        </Link>
        <Button href={video.url} color="secondary" target="_blank"
                startIcon={<YouTubeIcon/>} variant="text"
                endIcon={<LaunchIcon fontSize="small"/>}>
          Open in YouTube
        </Button>
        <Card>
          <CardContent>
            <Typography variant={"h5"}>
              Create clips from this video to help you study. Switch to practice mode to listen to a clip, imitate
              what you hear, and compare your speaking to the native recording.
            </Typography>

            <VideoClipSummary
              video={video}
              advice={value}
            />

          </CardContent>
        </Card>
      </Box>
      <VideoClipList videoUuid={video.videoId}
                     advice={value}
                     video={video}
                     muteSuggestion={muteSuggestion}
      />
    </>
  );
}

export const YouTubeVideoEditor = ({video}: { video: Video, onVideoChange: (v: Video) => void }) => {
  if (!video.files.hasMediaFile) {
    throw new Error("invalid condition")
  }
  const api = useBackendAPI();

  const callback = useCallback(() => api.videos.advice.GET(video.videoId), [video.videoId, api.videos.advice])
  const Into = useCallback((props: { value: VideoAdvice, setValue: (value: VideoAdvice) => void }) => {
    return (<LoadedEditor video={video} {...props} />)
  }, [video])

  return (
    <Box m={2}>
      <Container maxWidth='lg'>
        <Breadcrumbs aria-label="breadcrumb">
        </Breadcrumbs>

        <Loader callback={callback}
                into={Into}
        />
      </Container>
    </Box>
  );
};