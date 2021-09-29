import {Video} from "../../App/api";
import React from "react";

export const PendingYouTubeVideo = ({video}: { video: Video }) => {
  return (
    <div>
      <h3>Here are instructions on how to load video: {video.title}</h3>

      <pre>
        %&gt; cd ~/Library/Application Support/japanese-accent/data/media/

        %&gt; youtube-dl --write-auto-sub -f m4a -o '%(id)s.%(ext)s' -k --sub-lang ja https://www.youtube.com/watch?v={video.videoId}
      </pre>
    </div>
  );
};
