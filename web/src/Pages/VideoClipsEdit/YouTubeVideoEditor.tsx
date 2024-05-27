import {BasicClip, Video, VideoAdvice} from "../../api/types";
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
import {Loader, Settable} from "../../App/Loader";

type LoadedEditorProps = {
  video: Video,
  setVideo: (v: Video) => void,
  value: VideoAdvice,
  setValue: (value: VideoAdvice) => void
};

function LoadedEditor({video, value, setValue, setVideo}: LoadedEditorProps) {
  const muteSuggestion = useCallback((clipToMute: BasicClip) => {
    const newSuggestions = [...value.suggestedClips];

    newSuggestions.splice(newSuggestions.findIndex(testClip => testClip.uuid === clipToMute.uuid), 1, {
      ...clipToMute,
      labels: [...clipToMute.labels, "MUTED"],
    })

    setValue({
      ...value,
      suggestedClips: newSuggestions
    })
  }, [value, setValue]);

  const removeClip = useCallback((clip: BasicClip) => {
    const newClips = [...video.clips];
    newClips.splice(newClips.findIndex(testClip => testClip.uuid === clip.uuid), 1)

    setVideo({
      ...video,
      clips: newClips
    })
  }, [video, setVideo]);

  return (
    <>
      <Box paddingY={2} margin={0}>
        <Typography variant="h4">
          Editing Clips from <em>{video.title}</em>
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
                     setAdvice={setValue}
                     removeClip={removeClip}
      />
    </>
  );
}

export const YouTubeVideoEditor = ({video, onVideoChange}: { video: Video, onVideoChange: (v: Video) => void }) => {
  if (!video.files.hasMediaFile) {
    throw new Error("invalid condition")
  }
  const api = useBackendAPI();

  const callback = useCallback(() => api.videos.advice.GET(video.videoId), [video.videoId, api.videos.advice])
  const Into = useCallback((props: Settable<VideoAdvice>) => {
    return (<LoadedEditor video={video} setVideo={onVideoChange} {...props} />)
  }, [video, onVideoChange])

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