/* eslint-disable jsx-a11y/media-has-caption */

import {Grid, IconButton, LinearProgress} from "@mui/material";
import React, {useCallback, useEffect, useRef, useState} from "react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import {secondsToHumanReadable} from "../App/time";
import {useServerInteractionHistory} from "../App/useServerInteractionHistory";
import {makeStyles} from "tss-react/mui";

const useStyles = makeStyles<void>()((theme) => {
  return {
    playerControls: {
      textAlign: 'center',
    },
    skeletonProgress: {
      backgroundColor: theme.palette.action.disabled,
    }
  }
});

export declare type PlayerProps = {
  src: string
  duration: "auto" | { startSec: number, endSec: number }
  onPlaybackEnded?: () => void
  playing: boolean
  onPlayerStateChanged: (playing: boolean) => void,
  preferredStartTime?: number | undefined
  onPositionChange?: (ms: number) => void,
};

function noop() {
}

export const Player = ({
                         src,
                         duration,
                         onPlaybackEnded = noop,
                         playing,
                         onPlayerStateChanged,
                         preferredStartTime,
                         onPositionChange
                       }: PlayerProps) => {


  const audioRef = useRef<HTMLAudioElement>(null!);
  const playerProgressRef = useRef<HTMLDivElement>(null!);
  const [progress, setProgress] = useState(0);
  const [, {logError}] = useServerInteractionHistory();

  const {classes} = useStyles();

  useEffect(() => {
    if (playing) {
      audioRef.current?.play().catch(e => {
          logError(e);
          onPlayerStateChanged(false);
        }
      );
    } else {
      audioRef.current?.pause();
    }
  }, [playing, src, onPlayerStateChanged, logError])

  useEffect(() => {
    if (preferredStartTime && audioRef.current) {
      audioRef.current.currentTime = (preferredStartTime / 1000);
    }
  }, [preferredStartTime])

  const checkIsComplete = useCallback(() => {
    if (duration === "auto") {
      return audioRef.current?.ended || false;
    }

    return (audioRef.current?.currentTime || 0) >= duration.endSec;
  }, [duration]);

  const currentIcon = () => {
    if (playing) {
      return PauseIcon;
    }

    return PlayArrowIcon;
  };

  const PlayPauseIcon = currentIcon();

  const rewindStart = useCallback(() => {
    if (audioRef.current !== null) {
      audioRef.current.currentTime = (duration === "auto" ? 0 : duration.startSec);
    }
  }, [duration]);


  const play = useCallback(() => {
    if (audioRef.current === null) {
      return
    }

    onPlayerStateChanged(true);
    return audioRef.current?.play().catch(logError);
  }, [onPlayerStateChanged, logError]);

  const pause = useCallback(() => {
    onPlayerStateChanged(false);
    audioRef.current?.pause();
  }, [onPlayerStateChanged]);

  const toggle = useCallback(() => {
    if (!playing) {
      return play();
    } else {
      pause();
    }
  }, [playing, play, pause]);

  const ended = useCallback(() => {
    onPlayerStateChanged(false);
    rewindStart();
  }, [rewindStart, onPlayerStateChanged]);


  const calculatePlayerProgress = useCallback(() => {
    if (audioRef.current === null) {
      return 0;
    }
    let startSec, endSec;
    if (duration === "auto") {
      startSec = 0;
      endSec = audioRef.current.duration;
    } else {
      startSec = duration.startSec;
      endSec = duration.endSec;
    }

    const current = audioRef.current.currentTime - startSec;
    const total = endSec - startSec;
    return (current / total) * 100;
  }, [duration]);

  const handleProgressClick = useCallback((event: any) => {
    if (playerProgressRef.current !== null &&
      audioRef.current !== null) {
      let startSec, endSec;

      if (duration === "auto") {
        startSec = 0;
        endSec = audioRef.current.duration;
      } else {
        startSec = duration.startSec;
        endSec = duration.endSec;
      }

      const {x, width} = playerProgressRef.current.getBoundingClientRect();
      const pct = (event.clientX - x) / width;
      const total = endSec - startSec;
      const offset = pct * total;
      audioRef.current.currentTime = startSec + offset;

    }
  }, [duration]);

  const timeUpdate = useCallback(() => {
    setProgress(calculatePlayerProgress());
    if (audioRef.current === undefined || audioRef.current === null) {
      return;
    }
    onPositionChange?.(audioRef.current.currentTime * 1000);
    if (checkIsComplete()) {
      audioRef.current?.pause();
      onPlayerStateChanged(false);
      onPlaybackEnded?.();
      rewindStart();
    }
  }, [calculatePlayerProgress, checkIsComplete, onPlaybackEnded, onPlayerStateChanged, onPositionChange, rewindStart]);

  return (
    <Grid container item xs={12} justifyContent="center" alignItems="center" className={classes.playerControls}>
      <audio ref={audioRef} src={src} autoPlay={false} onEnded={ended} onTimeUpdate={timeUpdate}/>
      <Grid item xs={3}>
        <IconButton onClick={rewindStart} size="large">
          <ReplayIcon/>
        </IconButton>
        <IconButton onClick={toggle} color="primary" size="large">
          <PlayPauseIcon fontSize="large"/>
        </IconButton>
      </Grid>
      <Grid item xs={1}>
        {audioRef.current ? secondsToHumanReadable(audioRef.current?.currentTime) : "--:--"}
      </Grid>
      <Grid item xs={6}>
        <LinearProgress ref={playerProgressRef} onClick={handleProgressClick} variant="determinate"
                        value={progress}/>
      </Grid>
    </Grid>
  );
};

export const PlayerSkeleton = () => {
  const {classes} = useStyles();
  return (
    <Grid container item xs={12} justifyContent="center" alignItems="center" className={classes.playerControls}>
      <Grid item xs={3}>
        <IconButton disabled size="large">
          <ReplayIcon/>
        </IconButton>
        <IconButton disabled color="primary" size="large">
          <PlayArrowIcon fontSize="large"/>
        </IconButton>
      </Grid>
      <Grid item xs={1}>
        --:--
      </Grid>
      <Grid item xs={6}>
        <LinearProgress variant="determinate"
                        className={classes.skeletonProgress}
                        value={0}/>
      </Grid>
    </Grid>
  );
};
