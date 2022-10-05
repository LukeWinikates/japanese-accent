import React, {useEffect, useState} from "react";
import {Box, Breadcrumbs, Container, Link as BreadcrumbLink, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {VideoSummary} from "../../App/api";
import {Loadable} from "../../App/loadable";
import {VideoList} from "./VideoList";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import {videoSummariesGET} from "../../App/ApiRoutes";

export default function VideosIndexPage() {
  const {logError} = useServerInteractionHistory();
  const [videos, setVideos] = useState<Loadable<VideoSummary[]>>("loading");

  useEffect(() => {
    videoSummariesGET().then(r => setVideos({data: r.data})).catch(() => logError("unable to load videos"))
  }, [logError]);

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