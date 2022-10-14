import {DraftSegment, Video, VideoAdvice, VideoDraft} from "../../App/api";
import React, {useEffect, useState} from "react";
import {Box, Breadcrumbs, Button, Container, Grid, Typography} from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import LaunchIcon from '@mui/icons-material/Launch';
import DoneIcon from '@mui/icons-material/Done';
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import {AutoSavingTextField} from "./AutoSavingTextField";
import {DragDropComposableText} from "./DragDropComposableText";
import {Timeline} from "./Timeline";
import {Loadable} from "../../App/loadable";
import {videoAdviceGET, videoDraftGET, videoPublishPOST, videoPUT} from "../../App/ApiRoutes";

export const YouTubeVideoEditor = ({video, onVideoChange}: { video: Video, onVideoChange: (v: Video) => void }) => {
  const {logError} = useServerInteractionHistory();
  const [advice, setAdvice] = useState<Loadable<VideoAdvice>>("loading");
  const [draft, setDraft] = useState<Loadable<VideoDraft>>("loading");

  useEffect(() => {
    // Promise.all()
    videoAdviceGET(video.videoId)
      .then(r => setAdvice({data: r.data}));
    videoDraftGET(video.videoId)
      .then(r => setDraft({data: r.data}));
  }, [video.videoId, setAdvice, setDraft])

  const markComplete = () => {
    videoPublishPOST(video).then(() => {
      onVideoChange({
        ...video,
        videoStatus: "Complete"
      })
    }).catch(() => logError("unable to publish video"))
  };

  const setVideoText = (text: string) => {
    onVideoChange({
      ...video,
      text
    });
  }

  const saveVideo = () => {
    return videoPUT(video);
  };

  let addDraft = (newDraft: DraftSegment) => {
    if (draft === "loading" || advice === "loading") {
      return
    }
    setDraft({
      data: {
        ...draft.data,
        draftSegments: [...draft.data.draftSegments, newDraft]
      }
    })
    let suggestedSegments = [...advice.data.suggestedSegments];
    suggestedSegments.splice(suggestedSegments.findIndex(s => s.uuid === newDraft.parent), 1)
    setAdvice({
      data: {
        ...advice.data,
      suggestedSegments:  suggestedSegments
      }
    })
  };

  let muteSuggestion = (s: DraftSegment) => {
    if (advice === "loading") {
      return
    }
    let newSuggestions = [...advice.data.suggestedSegments];

    newSuggestions.splice(newSuggestions.indexOf(s), 1)
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
            {video.videoStatus === "Imported" &&
              <Button startIcon={<DoneIcon/>} onClick={markComplete}>
                Mark Video as Complete
              </Button>
            }
          </Typography>
          <Button href={video.url} color="secondary" target="_blank"
                  startIcon={<YouTubeIcon/>} variant="text"
                  endIcon={<LaunchIcon fontSize="small"/>}>
            Open in YouTube
          </Button>
        </Box>
        {
          advice !== "loading" && draft !== "loading" ?
            <Timeline videoUuid={video.videoId}
                      advice={advice.data}
                      draft={draft.data}
                      addDraft={addDraft}
                      muteSuggestion={muteSuggestion}
            /> :
            <></>
        }
        <Grid container style={{height: 600}}>
          <Grid item xs={5}>
            <AutoSavingTextField value={video.text} setText={setVideoText} save={saveVideo}/>
          </Grid>
          <Grid item xs={5}>
            <DragDropComposableText text={video.text}/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};