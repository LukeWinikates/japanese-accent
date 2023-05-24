import {SuggestedSegment, Video, VideoAdvice, Waveform as ApiWaveform} from "../../api/types";
import React, {useEffect, useState} from "react";
import {Box, Breadcrumbs, Button, Card, CardContent, Container, Typography} from "@mui/material";
import {VideoClipList} from "./VideoClipList";
import {Loadable} from "../../App/loadable";
import {videoAdviceGET} from "../../api/ApiRoutes";
import {Link} from "react-router-dom";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LaunchIcon from "@mui/icons-material/Launch";
import Mic from "@mui/icons-material/Mic";
import ListenIcon from '@mui/icons-material/Hearing';
import {VideoClipSummary} from "./VideoClipSummary";
import {useBackendAPI} from "../../App/useBackendAPI";

export const YouTubeVideoEditor = ({video, onVideoChange}: { video: Video, onVideoChange: (v: Video) => void }) => {
  const [advice, setAdvice] = useState<Loadable<VideoAdvice>>("loading");
  const [samplesData, setSamplesData] = useState<Loadable<ApiWaveform>>("loading");

  console.log("re-render", video)

  const api = useBackendAPI();

  useEffect(() => {
    videoAdviceGET(video.videoId)
      .then(r => setAdvice({data: r.data}));

  }, [video.videoId, setAdvice])

  useEffect(() => {
    api.waveform.GET(video.videoId, 80)
      .then(r => setSamplesData({data: r.data}))
  }, [video.videoId, setSamplesData, api.waveform])

  if (advice === "loading" || samplesData === "loading") {
    return (<>loading...</>);
  }

  let muteSuggestion = (segmentToMute: SuggestedSegment) => {
    let newSuggestions = [...advice.data.suggestedSegments];

    newSuggestions.splice(newSuggestions.findIndex(testSegment => testSegment.uuid === segmentToMute.uuid), 1, {
      ...segmentToMute,
      labels: [...segmentToMute.labels, "MUTED"],
    })

    setAdvice({
      data: {
        ...advice.data,
        suggestedSegments: newSuggestions
      }
    })
  };

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
                advice={advice.data}
                waveform={samplesData.data}
              />

            </CardContent>
          </Card>
        </Box>

        {
          <VideoClipList videoUuid={video.videoId}
                         advice={advice.data}
                         video={video}
                         muteSuggestion={muteSuggestion}
          />
        }

      </Container>
    </Box>
  )
    ;
};