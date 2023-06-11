import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Button, TextField} from "@mui/material";

import {Player} from "../../Dictaphone/Player";
import {TimeInput} from "./TimeInput";
import {msToHumanReadable} from "../../App/time";
import audioURL from "../../App/audioURL";
import {ClipResizingWaveform} from "../../Waveform/ResizingWaveform";
import {BasicClip} from "../../api/types";

export interface SegmentEditorProps<T extends BasicClip> {
  segment: T;
  setSegment: (segment: T) => void;
  previousSegmentEnd: number | null;
  nextSegmentStart: number | null;
}

export function SegmentEditor<T extends BasicClip>({
                                                      segment,
                                                      setSegment,
                                                      previousSegmentEnd,
                                                      nextSegmentStart
                                                    }: SegmentEditorProps<T>) {
  const [segmentIsPlaying, setSegmentIsPlaying] = useState<boolean>(false);
  const [preferredStartTime, setPreferredStartTime] = useState<number | undefined>(undefined);
  const [playerStartDebounce, setPlayerStartDebounce] = useState<Date | undefined>();
  const [playerPositionMS, setPlayerPositionMS] = useState(0);

  useEffect(() => {
    setSegmentIsPlaying(false);
    if (!playerStartDebounce) {
      return
    }
    const timer = setTimeout(() => {
      setSegmentIsPlaying(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [playerStartDebounce])


  const handleTextChange = useCallback((text: string) => {
    setSegment({
      ...segment,
      text
    });
  }, [segment, setSegment]);

  const handleStartChange = useCallback((newStart: number) => {
    const end = newStart >= segment.endMS ? newStart + 1000 : segment.endMS
    setSegment({
      ...segment,
      startMS: newStart,
      endMS: end
    });
  }, [segment, setSegment]);

  const handleEndChange = useCallback((newEnd: number) => {
    setSegment({
      ...segment,
      endMS: newEnd
    });
    setPreferredStartTime(newEnd - 1000);
    setPlayerStartDebounce(new Date())
  }, [setPreferredStartTime, setPlayerStartDebounce, segment, setSegment]);

  const duration = useMemo(() => {
    return {
      startSec: segment.startMS / 1000,
      endSec: segment.endMS / 1000
    }
  }, [segment.endMS, segment.startMS]);
  const onPlaybackEnded = useCallback(() => setSegmentIsPlaying(false), [setSegmentIsPlaying]);

  let alignPrevious = useCallback(() => previousSegmentEnd && handleStartChange(previousSegmentEnd), [handleStartChange, previousSegmentEnd]);
  let alignNext = useCallback(() => nextSegmentStart && handleEndChange(nextSegmentStart), [handleEndChange, nextSegmentStart]);
  let onTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => handleTextChange(event.target.value), [handleTextChange]);

  return (
    <>
      <ClipResizingWaveform
        segment={segment}
        setSegment={setSegment}
        playerPositionMS={playerPositionMS}
        onStartResizing={onPlaybackEnded}
      />

      <Player src={audioURL(segment)}
              duration={duration}
              playing={segmentIsPlaying}
              onPlayerStateChanged={setSegmentIsPlaying}
              preferredStartTime={preferredStartTime}
              onPositionChange={setPlayerPositionMS}
              onPlaybackEnded={onPlaybackEnded}
      />


      <TimeInput label="Start" onChange={handleStartChange} value={segment.startMS}/>
      {
        previousSegmentEnd &&
        <Button onClick={alignPrevious}>
          Align Start to Previous Segment End: {msToHumanReadable(previousSegmentEnd)}
        </Button>
      }
      <TimeInput label="End" onChange={handleEndChange} value={segment.endMS}/>
      {nextSegmentStart &&
        <Button onClick={alignNext}>
          Align End to Next Segment Start: {msToHumanReadable(nextSegmentStart)}
        </Button>
      }

      <TextField margin="normal"
                 value={segment.text} fullWidth={true}
                 multiline={true}
                 onChange={onTextChange}/>

    </>
  );
}

