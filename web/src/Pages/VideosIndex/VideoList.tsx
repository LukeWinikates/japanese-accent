import {VideoSummary} from "../../App/api";
import {List, ListItemIcon} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import {StatusIcon} from "../../Video/StatusIcon";
import {Link} from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";


function formatDate(video: VideoSummary) {
  const lastActivityAt = video.lastActivityAt;
  if (lastActivityAt !== "0001-01-01T00:00:00Z") {
    return "Last Practiced at: " + new Date(lastActivityAt).toLocaleDateString();
  }
  return "no practice activity"
}

export function VideoList({videos}:{videos: VideoSummary[]}) {
  return <List>
    {videos.map(video => {
      return (
        <ListItem key={video.videoId}>
          <ListItemIcon>{<StatusIcon status={video.videoStatus}/>}</ListItemIcon>
          <Link to={`/media/${video.videoId}`}>
            <ListItemText primary={video.title} secondary={formatDate(video)}/>
          </Link>
        </ListItem>
      );
    })}
  </List>;
}