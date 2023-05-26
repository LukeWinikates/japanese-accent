import React, {useEffect, useState} from "react";
import {Box, Breadcrumbs, Container, Link as BreadcrumbLink, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {VideoSummary} from "../../api/types";
import {Loadable} from "../../App/loadable";
import {VideoList} from "./VideoList";
import {useBackendAPI} from "../../App/useBackendAPI";

export default function VideosIndexPage() {
  const [videos, setVideos] = useState<Loadable<VideoSummary[]>>("loading");
  const api = useBackendAPI();

  useEffect(() => {
    api.videos.GET().then(r => setVideos({data: r.data}))
  }, [api.videos]);

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