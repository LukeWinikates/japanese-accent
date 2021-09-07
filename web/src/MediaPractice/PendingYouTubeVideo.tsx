import {Video} from "../api";
import React from "react";

export const PendingYouTubeVideo = ({video}: { video: Video}) => {
  return (
    <div>
      Here are instructions on how to load video: {video.title}
    </div>
  );
};
