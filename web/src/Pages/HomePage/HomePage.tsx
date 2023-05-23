import React, {useEffect, useState} from "react";
import {Box, Breadcrumbs, Container, Fab, Link as BreadcrumbLink, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {Highlights} from "../../api/types";
import AddIcon from '@mui/icons-material/Add';
import {Link, useNavigate} from "react-router-dom";
import {YouTubeVideoAddModal} from "./YouTubeVideoAddModal";
import {Loadable} from "../../App/loadable";
import {VideoList} from "../VideosIndex/VideoList";
import {WordListList} from "../WordList/WordListList";
import {useServerInteractionHistory} from "../../App/useServerInteractionHistory";
import {highlightsGET, playlistPOST} from "../../api/ApiRoutes";

export default function HomePage() {
  const {logError} = useServerInteractionHistory();
  const [highlights, setHighlights] = useState<Loadable<Highlights>>("loading");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  function closeDialog() {
    setDialogOpen(false);
  }

  useEffect(() => {
    highlightsGET().then(h => setHighlights({data: h.data})).catch(() => logError("unable to load homepage"))
  }, [logError]);

  function createQuick20AndNavigate() {
    playlistPOST().then(e => {
      navigate('/playlists/' + e.data.id)
    }).catch(() => logError("unable to create playlist"));
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
                  {
                    highlights === "loading" ? null :
                      <VideoList videos={highlights.data.videos}/>
                  }
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
                  {
                    highlights === "loading" ? null :
                      <WordListList wordLists={highlights.data.wordLists}/>
                  }
                </Grid>

              </Grid>
            </Box>
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