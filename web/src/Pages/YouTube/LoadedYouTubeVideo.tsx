import {Segment, Video} from "../../App/api";
import React, {useState} from "react";
import {Box, Breadcrumbs, Button, Container, Tab, Tabs, Typography} from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import LaunchIcon from '@mui/icons-material/Launch';
import {PlaylistPlayer} from "../../Dictaphone/PlaylistPlayer";
import DoneIcon from '@mui/icons-material/Done';
import {useFetch} from "use-http";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import AddIcon from "@mui/icons-material/Add";
import DraftSegmentDialog from "../../Video/Segments/DraftSegmentDialog";
import AddWordDialog from "../WordList/AddWordDialog";
import {WordListPlayer} from "../../Dictaphone/WordListPlayer";

type TabTypes = "segments" | "words" | "notes";

export const LoadedYouTubeVideo = ({video, onVideoChange}: { video: Video, onVideoChange: (v: Video) => void }) => {
  const {logError} = useServerInteractionHistory();
  const [isDraftDialogOpen, setIsDraftDialogOpen] = useState(false);
  const [isAddWordDialogOpen, setIsAddWordDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabTypes>("segments");

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
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Video Segments" value="segments"/>
          <Tab label="Vocabulary" value="words"/>
          <Tab label="Notes" value="notes"/>
        </Tabs>
        <Box marginY={2}>
          {
            activeTab === "segments" &&
            <PlaylistPlayer parentId={video.videoId} segments={video.segments} onSegmentsChange={setVideoSegments}/>
          }
          {
            activeTab === "words" &&
            <WordListPlayer words={video.words}/>
          }
          {
            activeTab === "notes" &&
            <strong>
              notes will go here
            </strong>
          }
        </Box>
      </Container>
    </Box>
  );
};