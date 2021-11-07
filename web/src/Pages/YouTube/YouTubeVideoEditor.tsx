import {Video} from "../../App/api";
import React, {ChangeEvent, useEffect, useState} from "react";
import {Box, Breadcrumbs, Button, CircularProgress, Container, Grid, TextField, Typography} from "@material-ui/core";
import YouTubeIcon from '@material-ui/icons/YouTube';
import LaunchIcon from '@material-ui/icons/Launch';
import DoneIcon from '@material-ui/icons/Done';
import {useFetch} from "use-http";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';

const Indicator = ({status}:{status:IndicatorStatus}) => {
  switch (status){
    case "busy":
      return <CircularProgress size={16} color="inherit" style={{padding: 5} }/>;
    case "error":
      return <ErrorIcon/>;
    case "idle":
      return <></>
    case "success":
      return <CheckIcon color="primary"/>;
  }
}

type IndicatorStatus = "idle" | "busy" | "success" | "error";

export const YouTubeVideoEditor = ({video, onVideoChange}: { video: Video, onVideoChange: (v: Video) => void }) => {
  const {logError} = useServerInteractionHistory();
  const publish = useFetch('/api/videos/' + video.videoId + '/publish');
  const {put} = useFetch('/api/videos/' + video.videoId);
  // const publish = useFetch('/api/videos/' + video.videoId + '/publish');
  const [lastTextEditTime, setLastTextEditTime] = useState<Date | undefined>();
  const [networkActivity, setNetworkActivity] = useState<IndicatorStatus>("idle");

  useEffect(() => {
    if (!lastTextEditTime) {
      return
    }
    const timer = setTimeout(() => {
      saveText();
    }, 2000);
    return () => clearTimeout(timer);
  }, [lastTextEditTime])

  const saveText = () => {
    put(video).then(() => setNetworkActivity("success")).catch(e => {
      logError(e);
      setNetworkActivity("error")
    });
  }

  async function markComplete() {
    await publish.post()
    if (publish.response.ok) {
      onVideoChange({
        ...video,
        videoStatus: "Complete"
      })
      return;
    }
    logError(publish.error?.message);
  }

  const setVideoText = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNetworkActivity("busy")
    const {value} = event.target;
    onVideoChange({
      ...video,
      text: value
    });
    setLastTextEditTime(new Date());
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

        <Grid container>
          <Grid item xs={6}>
            {
              video.segments.map(seg => {
                return (<div key={seg.uuid}>
                  {seg.start}
                  {seg.text}
                  {seg.end}
                </div>);
              })
            }
          </Grid>
          <Grid item xs={6}>
            <TextField multiline rows={15} fullWidth variant='outlined' onChange={setVideoText} value={video.text}/>
            <Indicator status={networkActivity}/>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};