import {Segment, Video} from "../../App/api";
import React, {useState} from "react";
import {Box, Breadcrumbs, Button, Container, Grid, makeStyles, Paper, Switch, Typography} from "@material-ui/core";
import YouTubeIcon from '@material-ui/icons/YouTube';
import LaunchIcon from '@material-ui/icons/Launch';
import DoneIcon from '@material-ui/icons/Done';
import {useFetch} from "use-http";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import {SegmentEditor} from "../../Video/Segments/SegmentEditor";
import {AutoSavingTextField} from "./AutoSavingTextField";
import {DragDropComposableText} from "./DragDropComposableText";
import {PlayableSegment} from "./PlayableSegment";
import {WithIndex} from "../../App/WithIndex";

const useStyles = makeStyles(() => ({
  deleteBox: {
    height: "100%"
  },
}));

export const YouTubeVideoEditor = ({video, onVideoChange}: { video: Video, onVideoChange: (v: Video) => void }) => {
  const {logError} = useServerInteractionHistory();
  const publish = useFetch('/api/videos/' + video.videoId + '/publish');
  const {put} = useFetch('/api/videos/' + video.videoId);
  const [currentSegment, setCurrentSegment] = useState<WithIndex<Segment>>({value: video.segments[0], index: 0});
  const {value: segment, index: currentSegmentIndex} = currentSegment;
  const [mode, setMode] = useState<"editing" | "composing">("editing");

  const classes = useStyles();

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

  function toggleMode() {
    setMode(mode === "editing" ? "composing" : "editing");
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
        <SegmentEditor
          segment={segment}
          setSegment={modifyCurrentSegment}
          previousSegmentEnd={video.segments[currentSegmentIndex - 1]?.end ?? 0}
          nextSegmentStart={video.segments[currentSegmentIndex + 1]?.start ?? 0}
        />

        <Grid container style={{height: 100}}>
          <Grid item xs={5} />
          <Grid item xs={5}>
            Video Text
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>Editing</Grid>
              <Grid item>
                <Switch checked={mode === "composing"} onChange={toggleMode} name="mode" color="primary"/>
              </Grid>
              <Grid item>Composing</Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Paper variant="outlined" className={classes.deleteBox}>
              Delete!
            </Paper>
          </Grid>
        </Grid>
        <Grid container style={{height: 600}}>
          <Grid item xs={5}
                style={{overflowY: "auto", height: "100%", display: "inline-flex", flexWrap: "wrap", width: "100%"}}>
            {
              video.segments.map((segment, i) =>
                <PlayableSegment segmentWithIndex={{value: segment, index: i}}
                                 onSegmentSelected={setCurrentSegment}
                                 key={segment.uuid}/>)
            }
          </Grid>
          <Grid item xs={5} style={{overflowY: "auto", height: "100%"}}>
            {
              mode === "editing" ?
                <AutoSavingTextField value={video.text} setText={setVideoText} save={saveVideo}/> :
                <DragDropComposableText text={video.text}/>
            }
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};