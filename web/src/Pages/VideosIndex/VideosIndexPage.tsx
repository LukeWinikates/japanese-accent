import React, {useEffect, useState} from "react";
import {Box, Breadcrumbs, Container, Link as BreadcrumbLink, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {VideoSummary} from "../../App/api";
import useFetch from "use-http";
import {Loadable} from "../../App/loadable";
import {VideoList} from "./VideoList";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";

export default function VideosIndexPage() {
  const {logError} = useServerInteractionHistory();
  const {get, response} = useFetch<VideoSummary[]>(
    "/api/videos");
  const [videos, setVideos] = useState<Loadable<VideoSummary[]>>("loading");
  useEffect(() => {
    async function initialize() {
      const videosResponse = await get('');
      if (response.ok) {
        setVideos({data: videosResponse});
      } else {
        logError("could not load videos")
      }
    }

    initialize();
  }, []);

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
                    videos === "loading" ? null :
                      <VideoList videos={videos.data}/>
                  }
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}