import {DraftSegment, Segment, Video, VideoAdvice, VideoDraft} from "../../App/api";
import React, {useEffect, useState} from "react";
import {Box, Breadcrumbs, Button, Container, Grid, Typography} from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import LaunchIcon from '@mui/icons-material/Launch';
import DoneIcon from '@mui/icons-material/Done';
import {useFetch} from "use-http";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import {AutoSavingTextField} from "./AutoSavingTextField";
import {DragDropComposableText} from "./DragDropComposableText";
import {WithIndex} from "../../App/WithIndex";
import {Timeline} from "./Timeline";
import {Loadable} from "../../App/loadable";

export const YouTubeVideoEditor = ({video, onVideoChange}: { video: Video, onVideoChange: (v: Video) => void }) => {
  const {logError} = useServerInteractionHistory();
  const publish = useFetch('/api/videos/' + video.videoId + '/publish');
  const adviceFetch = useFetch<VideoAdvice>('/api/videos/' + video.videoId + '/advice');
  const draftFetch = useFetch<VideoDraft>('/api/videos/' + video.videoId + '/draft');
  const {put} = useFetch('/api/videos/' + video.videoId);
  const [currentSegment, setCurrentSegment] = useState<WithIndex<Segment>>({value: video.segments[0], index: 0});
  const {value: segment, index: currentSegmentIndex} = currentSegment;
  const [advice, setAdvice] = useState<Loadable<VideoAdvice>>("loading");
  const [draft, setDraft] = useState<Loadable<VideoDraft>>("loading");
  const {post} = useFetch('/api/videos/' + video.videoId + "/segments/");

  useEffect(() => {
    adviceFetch.get().then(adviceResponse => setAdvice({data: adviceResponse}))
    draftFetch.get().then(draftResponse => setDraft({data: draftResponse}))
  }, [video.videoId])

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

  const modifyCurrentSegment = (segment: Segment) => {
    const editedSegment = segment;
    let newSegments = [...video.segments];
    newSegments.splice(currentSegmentIndex, 1, editedSegment);
    onVideoChange({
      ...video,
      segments: newSegments
    });
    setCurrentSegment({
      ...currentSegment,
      value: editedSegment
    })
  }

  const setVideoText = (text: string) => {
    onVideoChange({
      ...video,
      text
    });
  }

  const saveVideo = () => {
    return put({
      ...video,
    });
  };

  function addSegment(range: { startMS: number, endMS: number }) {
    post({
      text: "",
      videoUuid: video.videoId,
      start: range.startMS,
      end: range.endMS,
    }).then((s: Segment) => {
      onVideoChange({
        ...video,
        segments: [...video.segments, s]
      });
    }).catch(logError);
  }

  function setSegments(newSegments: DraftSegment[]) {
    throw "not implemented"
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
          advice != "loading" && draft != "loading" ?
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