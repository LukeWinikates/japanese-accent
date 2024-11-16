import React from "react";
import {Box, Breadcrumbs, Container, Link as BreadcrumbLink, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {VideoSummary} from "../../api/types";
import {VideoList} from "./VideoList";
import {useBackendAPI} from "../../App/useBackendAPI";
import {Loader, Settable} from "../../App/Loader";

function LoadedIndexPage({value}: Settable<VideoSummary[]>) {
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
                <VideoList videos={value}/>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default function VideosIndexPage() {
  const api = useBackendAPI();
  return (
    <Loader
      callback={api.videos.index.GET}
      into={LoadedIndexPage}
    />
  );
}
