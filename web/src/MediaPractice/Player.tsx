import {Grid, IconButton, LinearProgress, makeStyles} from "@material-ui/core";
import React, {useRef, useState} from "react";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import ReplayIcon from '@material-ui/icons/Replay';

const useStyles = makeStyles((theme) => ({
  playerControls: {
    textAlign: 'center',
  },
  dummyProgress: {
    backgroundColor: theme.palette.action.disabled,
  }
}));

export declare type PlayerProps = {
  src: string
  duration: "auto" | { startSec: number, endSec: number }
  autoplayOnChange: boolean
  onComplete?: () => void
};

function secondsToHumanReadable(sec: number) {
  const totalSeconds = Math.round(sec);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  return `${minutes}:${("" + seconds).padStart(2, "0")}`;
}

export const Player = ({src, duration, autoplayOnChange, onComplete}: PlayerProps) => {
  const classes = useStyles();

  const audioRef = useRef<HTMLAudioElement>(null);
  const playerProgressRef = useRef<HTMLDivElement>(null);
  const [playingSegment, setPlayingSegment] = useState(false);
  const [progress, setProgress] = useState(0);

  function checkIsComplete() {
    if (duration === "auto") {
      return audioRef.current?.ended || false;
    }

    return (audioRef.current?.currentTime || 0) >= (duration.endSec / 1000);
  }

  function timeUpdate() {
    setProgress(calculatePlayerProgress());
    if (audioRef.current === undefined || audioRef.current === null) {
      return;
    }
    if (checkIsComplete()) {
      audioRef.current?.pause();
      setPlayingSegment(false);
      onComplete && onComplete();
      rewindStart();
    }
  }

  const currentIcon = () => {
    if (playingSegment) {
      return PauseIcon;
    }

    return PlayArrowIcon;
  };

  const PlayPauseIcon = currentIcon();

  function rewindStart() {
    if (audioRef.current !== null) {
      audioRef.current.currentTime = (duration === "auto" ? 0 : duration.startSec / 1000);
    }
  }

  const toggle = () => {
    if (!playingSegment) {
      return play();
    } else {
      pause();
    }
  };

  const play = () => {
    if (audioRef.current === null) {
      return
    }

    setPlayingSegment(true);
    return audioRef.current?.play();
  };

  const pause = () => {
    setPlayingSegment(false);
    audioRef.current?.pause();
  };

  const ended = () => {
    setPlayingSegment(false);
    rewindStart();
  };


  const calculatePlayerProgress = () => {
    if (audioRef.current === null) {
      return 0;
    }
    let startSec, endSec;
    if (duration === "auto") {
      startSec = 0;
      endSec = audioRef.current.duration * 1000;
    } else {
      startSec = duration.startSec;
      endSec = duration.endSec;
    }

    const current = audioRef.current.currentTime - (startSec / 1000);
    const total = (endSec / 1000) - (startSec / 1000);
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
      const total = (endSec / 1000) - (startSec / 1000);
      const offset = pct * total;
      audioRef.current.currentTime = (startSec / 1000) + offset;

    }
  };

  return (
    <Grid container item xs={12} justify="center" alignItems="center" className={classes.playerControls}>
      <audio ref={audioRef} src={src} autoPlay={autoplayOnChange} onEnded={ended} onTimeUpdate={timeUpdate}/>
      <Grid item xs={3}>
        <IconButton onClick={() => rewindStart()}>
          <ReplayIcon/>
        </IconButton>
        <IconButton onClick={toggle} color="primary">
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

export const DummyPlayer = () => {
  const classes = useStyles();

  return (
    <Grid container item xs={12} justify="center" alignItems="center" className={classes.playerControls}>
      <Grid item xs={3}>
        <IconButton disabled>
          <ReplayIcon/>
        </IconButton>
        <IconButton disabled color="primary">
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
