import React, {useEffect, useState} from 'react';
import useFetch from "use-http";

import {duration, Segment} from "../api";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  Typography
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemText from "@material-ui/core/ListItemText";
import {MediaSegmentEditDialog} from "./MediaSegmentEditDialog";
import {Dictaphone} from "./Dictaphone";
import {useRouteMatch} from "react-router";
import {match} from "react-router/ts4.0";

type YoutubeVideoPageParams = string[];

function parseRouteSegments(match: match<YoutubeVideoPageParams>) {
  const urlSegments = match.params[0].split("/");
  const videoId = urlSegments[urlSegments.length - 2];
  const title = urlSegments[urlSegments.length - 1];
  return {
    videoId,
    title
  };
}

export const YoutubeVideoPage = () => {
  const match = useRouteMatch<YoutubeVideoPageParams>();
  const {
    videoId, title
  } = parseRouteSegments(match);

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

  async function handleModalClose() {
    if (editingSegment === null) {
      return;
    }
    const editedSegment = editingSegment;
    let newSegments = [...segments];
    newSegments.splice(currentSegmentIndex, 1, editedSegment);
    setEditingSegment(null);
    setSegments(newSegments);
    setCurrentSegment(editedSegment);
  }

  function removeCurrentSegment() {
    setEditingSegment(null);
    let newSegments = [...segments];
    newSegments.splice(currentSegmentIndex, 1)
    setSegments(newSegments);
    setSegmentByIndex(currentSegmentIndex - 1);
  }

  function addSegment(newSegment: Segment) {
    let newSegments = [...segments];
    newSegments.splice(currentSegmentIndex + 1, 0, newSegment)
    setSegments(newSegments);
  }

  function setSegmentByIndex(newIndex: number) {
    let segment = segments[newIndex];
    setCurrentSegmentIndex(newIndex);
    setCurrentSegment(segment);
  }

  if (currentSegment === null) {
    return (<></>);
  }

  let renderRow = (segment: Segment, index: number) => {
    return (
      <ListItem key={index}
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
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon/>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  return (
    <Box m={2}>
      <Container maxWidth='lg'>
        <Breadcrumbs aria-label="breadcrumb">
        </Breadcrumbs>

        <Box paddingY={2} margin={0}>
          <Typography variant="h2">
            {title}
            <Button endIcon={<EditIcon/>} onClick={() => setEditingSegment(currentSegment)}>
              Edit
            </Button>
          </Typography>
        </Box>

        <Card>
          <CardContent>
            {currentSegment &&
            <Dictaphone
              videoId={videoId}
              segment={currentSegment}
              setSegmentByIndex={setSegmentByIndex}
              lastSegmentIndex={lastIndex}
              segmentIndex={currentSegmentIndex}/>
            }
          </CardContent>
        </Card>

        <Box paddingY={2} margin={0}>
          <List>
            {
              segments.map(renderRow)
            }
          </List>

          {
            editingSegment !== null ?
              <MediaSegmentEditDialog
                open={!!editingSegment}
                onClose={handleModalClose}
                onDestroy={removeCurrentSegment}
                onAdd={addSegment}
                segment={editingSegment}
                setSegment={setEditingSegment}
                videoId={videoId}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              />
              : <> </>
          }
        </Box>
      </Container>
    </Box>
  );
};