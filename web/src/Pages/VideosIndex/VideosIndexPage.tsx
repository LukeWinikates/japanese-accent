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
import {VideoSummary} from "../../App/api";
import useFetch from "use-http";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {Link} from "react-router-dom";
import {Loadable} from "../../App/loadable";
import {StatusIcon} from "../../Video/StatusIcon";

export default function VideosIndexPage() {
  const {get, response} = useFetch<VideoSummary[]>(
    "/api/videos");
  const [videos, setVideos] = useState<Loadable<VideoSummary[]>>("loading");
  useEffect(() => {
    async function initialize() {
      const videosResponse = await get('');
      if (response.ok) {
        setVideos({data: videosResponse});
      }
    }

    initialize();
  }, []);

  function formatDate(video: VideoSummary) {
    const lastActivityAt = video.lastActivityAt;
    if (lastActivityAt !== "0001-01-01T00:00:00Z") {
      return "Last Practiced at: " + new Date(lastActivityAt).toLocaleDateString();
    }
    return "no practice activity"
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
                  {
                    videos === "loading" ? null :
                      <List>
                        {videos.data.map(video => {
                          return (
                            <ListItem key={video.videoId}>
                              <ListItemIcon>{<StatusIcon status={video.videoStatus}/>}</ListItemIcon>
                              <Link to={`/media/${video.videoId}`}>
                                <ListItemText primary={video.title} secondary={formatDate(video)}/>
                              </Link>
                            </ListItem>
                          );
                        })}
                      </List>
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