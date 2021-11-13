import {Segment, Video} from "../../App/api";
import React, {useState} from "react";
import {Box, Breadcrumbs, Button, Container, Typography} from "@material-ui/core";
import YouTubeIcon from '@material-ui/icons/YouTube';
import LaunchIcon from '@material-ui/icons/Launch';
import {PlaylistPlayer} from "../../Dictaphone/PlaylistPlayer";
import DoneIcon from '@material-ui/icons/Done';
import {useFetch} from "use-http";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import AddIcon from "@material-ui/icons/Add";
import DraftSegmentDialog from "../../Video/Segments/DraftSegmentDialog";
import AddWordDialog from "../WordList/AddWordDialog";

export const LoadedYouTubeVideo = ({video, onVideoChange}: { video: Video, onVideoChange: (v: Video) => void }) => {
  const {logError} = useServerInteractionHistory();
  const [isDraftDialogOpen, setIsDraftDialogOpen] = useState(false);
  const [isAddWordDialogOpen, setIsAddWordDialogOpen] = useState(false);

  function setVideoSegments(newSegments: Segment[]) {
    onVideoChange({
      ...video,
      segments: newSegments
    });
  }

  const publish = useFetch('/api/videos/' + video.videoId + '/publish');

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

  function openAddWordDialog() {
    setIsAddWordDialogOpen(true)
  }

  const onClose = () => {
    setIsAddWordDialogOpen(false);
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

        <Button onClick={() => setIsDraftDialogOpen(true)}>
          Add Segment <AddIcon/>
        </Button>

        <Button onClick={openAddWordDialog}>
          Add Word <AddIcon/>
        </Button>
        {
          isDraftDialogOpen && <DraftSegmentDialog videoId={video.videoId} onClose={() => setIsDraftDialogOpen(false)}/>
        }
        {
          isAddWordDialogOpen && <AddWordDialog videoId={video.videoId} onClose={onClose}/>
        }
        <PlaylistPlayer parentId={video.videoId} segments={video.segments} onSegmentsChange={setVideoSegments}/>
      </Container>
    </Box>
  );
};