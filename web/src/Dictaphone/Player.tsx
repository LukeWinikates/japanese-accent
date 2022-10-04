import {Grid, IconButton, LinearProgress} from "@mui/material";
import {styled} from '@mui/material/styles';
import React, {useEffect, useRef, useState} from "react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import {secondsToHumanReadable} from "../App/time";
import {useServerInteractionHistory} from "../Layout/useServerInteractionHistory";

const PREFIX = 'Player';

const classes = {
  playerControls: `${PREFIX}-playerControls`,
  dummyProgress: `${PREFIX}-dummyProgress`
};

const StyledGrid = styled(Grid)((
  {
    theme
  }
) => ({
  [`&.${classes.playerControls}`]: {
    textAlign: 'center',
  },

  [`& .${classes.dummyProgress}`]: {
    backgroundColor: theme.palette.action.disabled,
  }
}));

export declare type PlayerProps = {
  src: string
  duration: "auto" | { startSec: number, endSec: number }
  onPlaybackEnded?: () => void
  playing: boolean
  onPlayerStateChanged: (playing: boolean) => void,
  preferredStartTime?: number
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


  const audioRef = useRef<HTMLAudioElement>(null);
  const playerProgressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const {logError} = useServerInteractionHistory();

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


  function checkIsComplete() {
    if (duration === "auto") {
      return audioRef.current?.ended || false;
    }

    return (audioRef.current?.currentTime || 0) >= duration.endSec;
  }

  function timeUpdate() {
    setProgress(calculatePlayerProgress());
    if (audioRef.current === undefined || audioRef.current === null) {
      return;
    }
    onPositionChange && onPositionChange(audioRef.current.currentTime * 1000)
    if (checkIsComplete()) {
      audioRef.current?.pause();
      onPlayerStateChanged(false);
      onPlaybackEnded();
      rewindStart();
    }
  }

  const currentIcon = () => {
    if (playing) {
      return PauseIcon;
    }

    return PlayArrowIcon;
  };

  const PlayPauseIcon = currentIcon();

  function rewindStart() {
    if (audioRef.current !== null) {
      audioRef.current.currentTime = (duration === "auto" ? 0 : duration.startSec);
    }
  }

  const toggle = () => {
    if (!playing) {
      return play();
    } else {
      pause();
    }
  };

  const play = () => {
    if (audioRef.current === null) {
      return
    }

    onPlayerStateChanged(true);
    return audioRef.current?.play().catch(logError);
  };

  const pause = () => {
    onPlayerStateChanged(false);
    audioRef.current?.pause();
  };

  const ended = () => {
    onPlayerStateChanged(false);
    rewindStart();
  };


  const calculatePlayerProgress = () => {
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
  };

  const handleProgressClick = (event: any) => {
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
  };

  return (
    <StyledGrid container item xs={12} justifyContent="center" alignItems="center" className={classes.playerControls}>
      <audio ref={audioRef} src={src} autoPlay={false} onEnded={ended} onTimeUpdate={timeUpdate}/>
      <Grid item xs={3}>
        <IconButton onClick={() => rewindStart()} size="large">
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
    </StyledGrid>
  );
};

export const DummyPlayer = () => {


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
                        className={classes.dummyProgress}
                        value={0}/>
      </Grid>
    </Grid>
  );
};
