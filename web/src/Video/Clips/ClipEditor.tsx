import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Button, Grid, TextField} from "@mui/material";

import {Player} from "../../Dictaphone/Player";
import {TimeInput} from "./TimeInput";
import {msToHumanReadable} from "../../App/time";
import audioURL from "../../App/audioURL";
import {ClipResizingWaveform} from "../../Waveform/ResizingWaveform";
import {BasicClip} from "../../api/types";
import {TextOptionChooser} from "./TextOptionChooser";

interface Props<T extends BasicClip> {
  clip: T;
  setClip: (clip: T) => void;
  previousClipEndMS: number | null;
  nextClipStartMS: number | null;
  textSuggestions: string[]
}

export function ClipEditor<T extends BasicClip>({
                                                  clip,
                                                  setClip,
                                                  previousClipEndMS,
                                                  nextClipStartMS,
                                                  textSuggestions
                                                }: Props<T>) {
  const [clipIsPlaying, setClipIsPlaying] = useState<boolean>(false);
  const [preferredStartTime, setPreferredStartTime] = useState<number | undefined>(undefined);
  const [playerStartDebounce, setPlayerStartDebounce] = useState<Date | undefined>();
  const [playerPositionMS, setPlayerPositionMS] = useState(0);

  useEffect(() => {
    setClipIsPlaying(false);
    if (!playerStartDebounce) {
      return
    }
    const timer = setTimeout(() => {
      setClipIsPlaying(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [playerStartDebounce])


  const handleTextChange = useCallback((text: string) => {
    setClip({
      ...clip,
      text
    });
  }, [clip, setClip]);

  const handleStartChange = useCallback((newStart: number) => {
    const end = newStart >= clip.endMS ? newStart + 1000 : clip.endMS
    setClip({
      ...clip,
      startMS: newStart,
      endMS: end
    });
  }, [clip, setClip]);

  const handleEndChange = useCallback((newEnd: number) => {
    setClip({
      ...clip,
      endMS: newEnd
    });
    setPreferredStartTime(newEnd - 1000);
    setPlayerStartDebounce(new Date())
  }, [setPreferredStartTime, setPlayerStartDebounce, clip, setClip]);

  const duration = useMemo(() => {
    return {
      startSec: clip.startMS / 1000,
      endSec: clip.endMS / 1000
    }
  }, [clip.endMS, clip.startMS]);
  const onPlaybackEnded = useCallback(() => setClipIsPlaying(false), [setClipIsPlaying]);

  const alignPrevious = useCallback(() => previousClipEndMS && handleStartChange(previousClipEndMS), [handleStartChange, previousClipEndMS]);
  const alignNext = useCallback(() => nextClipStartMS && handleEndChange(nextClipStartMS), [handleEndChange, nextClipStartMS]);
  const onTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => handleTextChange(event.target.value), [handleTextChange]);

  return (
    <>
      <ClipResizingWaveform
        clip={clip}
        setClip={setClip}
        playerPositionMS={playerPositionMS}
        onStartResizing={onPlaybackEnded}
      />

      <Player src={audioURL(clip)}
              duration={duration}
              playing={clipIsPlaying}
              onPlayerStateChanged={setClipIsPlaying}
              preferredStartTime={preferredStartTime}
              onPositionChange={setPlayerPositionMS}
              onPlaybackEnded={onPlaybackEnded}
      />


      <TimeInput label="Start" onChange={handleStartChange} value={clip.startMS}/>
      {
        previousClipEndMS &&
        <Button onClick={alignPrevious}>
          Align Start to Previous Clip End: {msToHumanReadable(previousClipEndMS)}
        </Button>
      }
      <TimeInput label="End" onChange={handleEndChange} value={clip.endMS}/>
      {nextClipStartMS &&
        <Button onClick={alignNext}>
          Align End to Next Clip Start: {msToHumanReadable(nextClipStartMS)}
        </Button>
      }
      <Grid container>
        <Grid item xs={6}>
          <TextField margin="normal"
                     value={clip.text} fullWidth={true}
                     multiline={true}
                     onChange={onTextChange}/>
        </Grid>
        <Grid item xs={6}>
          <TextOptionChooser
            onChooseItem={handleTextChange}
            options={textSuggestions}
            />
        </Grid>

      </Grid>
    </>
  );
}

