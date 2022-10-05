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
import {videoAdviceGET, videoDraftGET, videoPublishPOST, videoPUT, videoSegmentPOST} from "../../App/ApiRoutes";

export const YouTubeVideoEditor = ({video, onVideoChange}: { video: Video, onVideoChange: (v: Video) => void }) => {
  const {logError} = useServerInteractionHistory();
  const [advice, setAdvice] = useState<Loadable<VideoAdvice>>("loading");
  const [draft, setDraft] = useState<Loadable<VideoDraft>>("loading");

  useEffect(() => {
    videoAdviceGET(video)
      .then(r => setAdvice({data: r.data}));
    videoDraftGET(video)
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

  function addSegment(range: { startMS: number, endMS: number }) {
    let data = {
      text: "",
      videoUuid: video.videoId,
      start: range.startMS,
      end: range.endMS,
    };
    videoSegmentPOST(video.videoId, data).then(r => {
      const s = r.data;
      onVideoChange({
        ...video,
        segments: [...video.segments, s]
      });
    }).catch(logError);
  }

  function setSegments(newSegments: DraftSegment[]) {
    console.log("not implemented", newSegments);
  }

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
                      addSegment={addSegment}
                      setSegments={setSegments}
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