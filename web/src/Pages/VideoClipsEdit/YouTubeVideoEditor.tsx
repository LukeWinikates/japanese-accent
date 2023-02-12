import {Segment, SuggestedSegment, Video, VideoAdvice, Waveform as ApiWaveform} from "../../App/api";
import React, {useEffect, useState} from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import {Timeline} from "./Timeline";
import {Loadable} from "../../App/loadable";
import {videoAdviceGET, waveformGET} from "../../App/ApiRoutes";
import {msToHumanReadable} from "../../App/time";
import {MiniWaveform} from "./MiniWaveform";
import {Link} from "react-router-dom";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LaunchIcon from "@mui/icons-material/Launch";
import Mic from "@mui/icons-material/Mic";
import ListenIcon from '@mui/icons-material/Hearing';

export const YouTubeVideoEditor = ({video, onVideoChange}: { video: Video, onVideoChange: (v: Video) => void }) => {
  const {logError} = useServerInteractionHistory();
  const [advice, setAdvice] = useState<Loadable<VideoAdvice>>("loading");
  const [samplesData, setSamplesData] = useState<Loadable<ApiWaveform>>("loading");

  useEffect(() => {
    // Promise.all()
    videoAdviceGET(video.videoId)
      .then(r => setAdvice({data: r.data})).catch(logError);

  }, [video.videoId, setAdvice, logError])

  useEffect(() => {
    waveformGET(video.videoId)
      .then(r => setSamplesData({data: r.data})).catch(logError)
  }, [video.videoId, setSamplesData, logError])

  if (advice === "loading" || samplesData === "loading") {
    return (<>loading...</>);
  }

  const draftsDuration = video.segments.map(seg => seg.endMS - seg.startMS).reduce((len, memo) => memo + len, 0);
  const totalMS = advice.data.suggestedSegments[advice.data.suggestedSegments.length - 1].endMS;


  let addSegment = (newDraft: Segment) => {
    // setDraft({
    //   data: {
    //     ...draft.data,
    //     draftSegments: [...draft.data.draftSegments, newDraft]
    //   }
    // })
    let suggestedSegments = [...advice.data.suggestedSegments];
    suggestedSegments.splice(suggestedSegments.findIndex(s => s.uuid === newDraft.parent), 1)
    setAdvice({
      data: {
        ...advice.data,
        suggestedSegments: suggestedSegments
      }
    })
  };

  let muteSuggestion = (segmentToMute: SuggestedSegment) => {
    console.log("got here")
    let newSuggestions = [...advice.data.suggestedSegments];
    console.log("newSuggestions", newSuggestions)
    console.log("segmentToMute", segmentToMute)
    console.log("index", newSuggestions.findIndex(testSegment => testSegment.uuid === segmentToMute.uuid))

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
                Create clips from this video to help you study. Switch to practice mode to listen to a clip, imitate what you hear, and compare your speaking to the native recording.
              </Typography>

              <Grid container>
                <Grid xs={4} item container>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="stretch"
                    spacing={2}
                  >
                    <Typography>{video.segments.length}</Typography>
                    <Typography>Clips Created</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="stretch"
                    spacing={2}
                  >
                    <Typography>{advice.data.suggestedSegments.length}</Typography>
                    <Typography>Suggested Clips Available to Review</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="stretch"
                    spacing={2}
                  >
                    <Typography>{msToHumanReadable(draftsDuration)}</Typography>
                    <Typography>Total Clip Duration</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="stretch"
                    spacing={2}
                  >
                    <Typography>{msToHumanReadable(totalMS)}</Typography>
                    <Typography>Source Video Length</Typography>
                  </Stack>

                  <Stack>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                      <Box sx={{width: '100%', mr: 1}}>
                        <LinearProgress variant="determinate" value={draftsDuration / totalMS}/>
                      </Box>
                      <Box sx={{minWidth: 35}}>
                        <Typography variant="body2" color="text.secondary">{`${Math.round(
                          draftsDuration / totalMS
                        )}%`}</Typography>
                      </Box>
                      <Box>
                        Video
                      </Box>
                    </Box>
                  </Stack>

                </Grid>
                <Grid item container xs={8}>
                  <MiniWaveform samples={samplesData.data.samples} sampleRate={samplesData.data.sampleRate}
                                playerPositionMS={0} initWidth={740}/>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {
          <Timeline videoUuid={video.videoId}
                    advice={advice.data}
                    video={video}
                    addSegment={addSegment}
                    muteSuggestion={muteSuggestion}
          />
        }

      </Container>
    </Box>
  )
    ;
};