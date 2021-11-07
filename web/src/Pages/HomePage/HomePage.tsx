import React, {useEffect, useState} from "react";
import {Box, Breadcrumbs, Container, Fab, Link as BreadcrumbLink, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {Highlights, Playlist} from "../../App/api";
import useFetch from "use-http";
import AddIcon from '@material-ui/icons/Add';
import {Link, useHistory} from "react-router-dom";
import {YouTubeVideoAddModal} from "./YouTubeVideoAddModal";
import {Loadable} from "../../App/loadable";
import {VideoList} from "../VideosIndex/VideoList";
import {WordListList} from "../WordList/WordListList";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";

export default function HomePage() {
  const {logError} = useServerInteractionHistory();
  const {get, response} = useFetch<Highlights>(
    "/api/highlights");

  const autoPlaylist = useFetch<Playlist>("/api/playlists");
  const [highlights, setHighlights] = useState<Loadable<Highlights>>("loading");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const history = useHistory();

  function closeDialog() {
    setDialogOpen(false);
  }


  useEffect(() => {
    async function initialize() {
      const highlightsResponse = await get('');
      if (response.ok) {
        setHighlights({data: highlightsResponse});
      } else {
        logError("unable to load homepage data")
      }
    }

    initialize().catch(logError);
  }, [highlights]);

  async function createQuick20AndNavigate() {
    await autoPlaylist.post({
      count: 20
    });

    if (autoPlaylist.response.ok) {
      if (autoPlaylist.response.data === undefined) return
      history.push('/playlists/' + autoPlaylist.response.data.id)
    } else {
      logError("unable to create playlist");
    }
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