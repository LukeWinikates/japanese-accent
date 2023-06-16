import {Box, Grid, LinearProgress, Stack, Typography} from "@mui/material";
import {msToHumanReadable} from "../../App/time";
import React from "react";
import {Video, VideoAdvice} from "../../api/types";

declare type Props = {
  video: Video,
  advice: VideoAdvice
}

export const VideoClipSummary = ({video, advice}: Props) => {
  const clipsDuration = video.clips.map(seg => {
    return seg.endMS - seg.startMS;
  }).reduce((len, memo) => {
    return memo + len;
  }, 0);
  const totalMS = advice.suggestedClips[advice.suggestedClips.length - 1].endMS;

  return (
    <Stack spacing={2}>
      <Grid container>
        <Grid item container xs={6} spacing={2}>
          <Grid item xs={6}>
            Clips Created
          </Grid>
          <Grid item xs={2}>
            {video.clips.length}
          </Grid>
          <Grid item xs={4}>
            {msToHumanReadable(clipsDuration)}
          </Grid>
        </Grid>
        <Grid item container xs={6} spacing={2}>
          <Grid item xs={6}>
            Suggested Clips to Review
          </Grid>
          <Grid item xs={2}>
            {advice.suggestedClips.length}
          </Grid>
          <Grid item xs={4}>
            {msToHumanReadable(totalMS)}
          </Grid>
        </Grid>
      </Grid>
      <Stack>
        <Box>
          % Of Video Represented by Clips
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Box sx={{width: '100%', mr: 1}}>
            <LinearProgress variant="determinate" value={clipsDuration / totalMS}/>
          </Box>
          <Box sx={{minWidth: 35}}>
            <Typography variant="body2" color="text.secondary">{`${Math.round(
              clipsDuration / totalMS
            )}%`}</Typography>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}