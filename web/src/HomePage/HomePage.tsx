import React, {useEffect, useState} from "react";
import {
  Box,
  Breadcrumbs,
  Container,
  Fab,
  Link as BreadcrumbLink,
  List,
  ListItemIcon,
  Typography
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {Highlights} from "../api";
import useFetch from "use-http";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import YouTubeIcon from '@material-ui/icons/YouTube';
import AddIcon from '@material-ui/icons/Add';
import {Link} from "react-router-dom";
import {YouTubeVideoAddModal} from "./YouTubeVideoAddModal";
import {Loadable} from "../loadable";

function HomePage() {

  const {get, response} = useFetch<Highlights>(
    "/api/highlights");
  const [highlights, setHighlights] = useState<Loadable<Highlights>>("loading");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  function closeDialog() {
    setDialogOpen(false);
  }

  useEffect(() => {
    async function initialize() {
      const highlightsResponse = await get('');
      if (response.ok) {
        setHighlights({data: highlightsResponse});
      }
    }

    initialize();
  }, [highlights]);

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
                  {
                    highlights === "loading" ? null :
                      <List>
                        {highlights.data.videos.map(video => {
                          return (
                            <ListItem key={video.videoId}>
                              <ListItemIcon>{<YouTubeIcon/>}</ListItemIcon>
                              <Link to={`/media/${video.videoId}`}>
                                <ListItemText primary={video.title}/>
                              </Link>
                            </ListItem>
                          );
                        })}
                      </List>
                  }
                </Grid>
                <Grid container item xs={6}>
                  <Typography variant="h4">
                    Word Lists
                  </Typography>
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
      <YouTubeVideoAddModal open={dialogOpen} onClose={closeDialog}/>
    </>
  );
}

export default HomePage;
