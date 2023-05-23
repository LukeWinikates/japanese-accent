import {VideoSummary} from "../../api/types";
import {List, ListItemSecondaryAction} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {Link} from "react-router-dom";
import ListItemText from "@mui/material/ListItemText";
import React from "react";


function formatDate(video: VideoSummary) {
  const lastActivityAt = video.lastActivityAt;
  if (lastActivityAt !== "0001-01-01T00:00:00Z") {
    return "Last Practiced at: " + new Date(lastActivityAt).toLocaleDateString();
  }
  return "no practice activity"
}

export function VideoList({videos}: { videos: VideoSummary[] }) {
  return <List>
    {videos.map(video => {
      return (
        <ListItem key={video.videoId}>
          <Link to={`/media/${video.videoId}`}>
            <ListItemText primary={video.title} secondary={formatDate(video)}/>
          </Link>
          <ListItemSecondaryAction>
            <Link to={`/media/${video.videoId}/edit`}>Edit</Link>
          </ListItemSecondaryAction>
        </ListItem>
      );
    })}
  </List>;
}