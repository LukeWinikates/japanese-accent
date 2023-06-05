import React, {useState} from "react";
import {Box, Breadcrumbs, Container, Fab, Link as BreadcrumbLink, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {Highlights} from "../../api/types";
import AddIcon from '@mui/icons-material/Add';
import {Link, useNavigate} from "react-router-dom";
import {YouTubeVideoAddModal} from "./YouTubeVideoAddModal";
import {VideoList} from "../VideosIndex/VideoList";
import {WordListList} from "../WordList/WordListList";
import {useBackendAPI} from "../../App/useBackendAPI";
import {Loader} from "../../App/Loader";

function LoadedHomePage({value}: { value: Highlights }) {
  return (
    <Box paddingY={2} margin={0}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="h4">
            Youtube Videos
          </Typography>
          <Typography variant="subtitle1">
            <Link to="/videos">
              See all
            </Link>
          </Typography>
          <VideoList videos={value.videos}/>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">
            Word Lists
          </Typography>
          <Typography variant="subtitle1">
            <Link to="/wordlists">
              See all
            </Link>
          </Typography>
          <WordListList wordLists={value.wordLists}/>
        </Grid>
      </Grid>
    </Box>
)
  ;
}

export default function HomePage() {
  const api = useBackendAPI();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  function closeDialog() {
    setDialogOpen(false);
  }

  function createQuick20AndNavigate() {
    api.playlists.POST({count: 20}).then(e => {
      navigate('/playlists/' + e.data.id)
    });
  }

  return (
    <>
      <Box m={2}>
        <Container maxWidth='lg'>
          <Breadcrumbs aria-label="breadcrumb">
            <BreadcrumbLink color="inherit" href="/">
              Home
            </BreadcrumbLink>
          </Breadcrumbs>

          <Box paddingY={2} margin={0}>
            <Typography variant="h2">
              Japanese Accent Practice
            </Typography>
            <Loader callback={api.highlights.GET}
                    into={LoadedHomePage}/>
          </Box>
        </Container>
      </Box>
      <Fab variant="extended" onClick={() => setDialogOpen(true)}>
        <AddIcon/>
        Add YouTube video
      </Fab>
      <Fab variant="extended" onClick={createQuick20AndNavigate}>
        <AddIcon/>
        Quick 20
      </Fab>
      <YouTubeVideoAddModal open={dialogOpen} onClose={closeDialog}/>
    </>
);
}