import React, {useEffect, useState} from 'react';
import useFetch from "use-http";

import {duration, Segment} from "../api";
import {Box, Breadcrumbs, Button, Container, Grid, ListItem, Typography} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import {FixedSizeList, ListChildComponentProps} from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import ListItemText from "@material-ui/core/ListItemText";
import {MediaSegmentEditDialog} from "./MediaSegmentEditDialog";
import {Dictaphone} from "./Dictaphone";
import {useRouteMatch} from "react-router";

type YoutubeVideoPageParams = string[];

export const YoutubeVideoPage = () => {
  const match = useRouteMatch<YoutubeVideoPageParams>();
  const urlSegments = match.params[0].split("/");
  const videoId = urlSegments[urlSegments.length - 1];

  const [segments, setSegments] = useState<Segment[]>([]);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [currentSegment, setCurrentSegment] = useState<Segment | null>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const lastIndex = segments.length - 1;

  const {get, response} = useFetch<Segment[]>(
    '/media/audio/' + videoId + "/segments");

  async function initialize() {
    const segmentsResponse = await get('');
    if (response.ok) {
      setSegments(segmentsResponse);
      setCurrentSegment(segmentsResponse[0]);
      setCurrentSegmentIndex(0);
      return segmentsResponse
    }
  }

  useEffect(() => {
    initialize();
  }, [videoId]);

  function pauseAll() {
    document.querySelectorAll("audio").forEach(a => a.pause());
  }

  function renderRow(props: ListChildComponentProps) {
    const {index, style} = props;
    if (segments.length === 0) return (<></>);
    const segment = segments[index];

    return (
      <ListItem style={style} key={index}
                selected={currentSegmentIndex === index}
                alignItems="flex-start"
                onClick={() => {
                  pauseAll();
                  setCurrentSegment(segment);
                  setCurrentSegmentIndex(index);
                }}
      >
        <ListItemText
          primaryTypographyProps={{noWrap: true, variant: "body2"}}
          primary={segment.text}
          secondary={Math.round(duration(segment)) + "s"}
        >
        </ListItemText>
      </ListItem>
    );
  }

  async function handleModalClose() {
    setEditingSegment(null);
    await initialize();
  }

  function setSegmentByIndex(newIndex: number) {
    let segment = segments[newIndex];
    setCurrentSegmentIndex(newIndex);
    setCurrentSegment(segment);
  }

  if (currentSegment === null) {
    return (<></>);
  }

  return (
    <Box m={2}>
      <Container maxWidth='lg'>
        <Breadcrumbs aria-label="breadcrumb">
        </Breadcrumbs>

        <Box paddingY={2} margin={0}>
          <Typography variant="h2">
            {videoId}
          </Typography>
        </Box>


        <Box paddingY={2} margin={0}>
          <Grid container spacing={1}>
            <Grid container item xs={5}>
              <Grid item xs={9}>
                <Typography variant="h5">
                  Native Recordings
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Button endIcon={<EditIcon/>} onClick={() => setEditingSegment(currentSegment)}>
                  Edit
                </Button>
              </Grid>
              <Grid item xs={12}>
                <AutoSizer disableHeight={true}>
                  {({width}) =>
                    <FixedSizeList height={300} width={width} itemSize={60} itemCount={segments.length}>
                      {renderRow}
                    </FixedSizeList>
                  }
                </AutoSizer>
              </Grid>
            </Grid>

            <Grid container item xs={7} spacing={1}>
              {currentSegment &&
              <Dictaphone
                videoId={videoId}
                segment={currentSegment}
                setSegmentByIndex={setSegmentByIndex}
                lastSegmentIndex={lastIndex}
                segmentIndex={currentSegmentIndex}/>
              }
            </Grid>
            {
              editingSegment !== null ?
                <MediaSegmentEditDialog
                  open={!!editingSegment}
                  onClose={handleModalClose}
                  segment={editingSegment}
                  setSegment={setEditingSegment}
                  videoId={videoId}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                />
                : <> </>
            }
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};