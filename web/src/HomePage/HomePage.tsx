import React, {useEffect, useState} from "react";
import {Box, Breadcrumbs, Container, Link as BreadcrumbLink, List, ListItemIcon, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {Highlights} from "../api";
import useFetch from "use-http";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import YoutubeIcon from '@material-ui/icons/YouTube';
import {Link} from "react-router-dom";

declare type Loadable<T> = "loading" | { data: T };

function HomePage() {

  const {get, response} = useFetch<Highlights>(
    "/api/highlights");
  const [highlights, setHighlights] = useState<Loadable<Highlights>>("loading");


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
                            <ListItemIcon>{<YoutubeIcon/>}</ListItemIcon>
                            <Link to={`/media/${video.videoId}/${video.text}`}>
                              <ListItemText primary={video.text}></ListItemText>
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
  );
}

export default HomePage;
