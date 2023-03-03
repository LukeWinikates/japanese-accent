import {Box, Grid, LinearProgress, Stack, Typography} from "@mui/material";
import {msToHumanReadable} from "../../App/time";
import {MiniWaveform} from "./MiniWaveform";
import React from "react";
import {Video, VideoAdvice} from "../../App/api";

declare type Props = {
  video: Video,
  advice: VideoAdvice
}

export const VideoClipSummary = ({video, advice}: Props) => {
  const draftsDuration = video.segments.map(seg => seg.endMS - seg.startMS).reduce((len, memo) => memo + len, 0);
  const totalMS = advice.suggestedSegments[advice.suggestedSegments.length - 1].endMS;

  return (
    <Grid container>
      <Grid xs={4} item container>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          spacing={2}
        >
          <Typography>{video.segments.length}</Typography>
          <Typography>Clips Created</Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          spacing={2}
        >
          <Typography>{advice.suggestedSegments.length}</Typography>
          <Typography>Suggested Clips Available to Review</Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          spacing={2}
        >
          <Typography>{msToHumanReadable(draftsDuration)}</Typography>
          <Typography>Total Clip Duration</Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          spacing={2}
        >
          <Typography>{msToHumanReadable(totalMS)}</Typography>
          <Typography>Source Video Length</Typography>
        </Stack>

        <Stack>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box sx={{width: '100%', mr: 1}}>
              <LinearProgress variant="determinate" value={draftsDuration / totalMS}/>
            </Box>
            <Box sx={{minWidth: 35}}>
              <Typography variant="body2" color="text.secondary">{`${Math.round(
                draftsDuration / totalMS
              )}%`}</Typography>
            </Box>
            <Box>
              Video
            </Box>
          </Box>
        </Stack>

      </Grid>
      <Grid item container xs={8}>
        <MiniWaveform url={`/api/videos/${video.videoId}/waveform_binary`}
                      playerPositionMS={0} initWidth={740}/>
      </Grid>
    </Grid>
  );
}