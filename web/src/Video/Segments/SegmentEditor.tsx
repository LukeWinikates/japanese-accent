import React, {useEffect, useState} from 'react';
import {Button, TextField} from "@mui/material";

import {Player} from "../../Dictaphone/Player";
import {TimeInput} from "./TimeInput";
import {msToHumanReadable} from "../../App/time";
import audioURL from "../../App/audioURL";

interface Segmentish {
  startMS: number;
  endMS: number;
  videoUuid: string;
  text: string;
}

export interface SegmentEditorProps<T extends Segmentish> {
  segment: T;
  setSegment: (segment: T) => void;
  previousSegmentEnd: number | null;
  nextSegmentStart: number | null;
}


export function SegmentEditor<T extends Segmentish>({segment, setSegment, previousSegmentEnd, nextSegmentStart}: SegmentEditorProps<T>) {
  const [segmentIsPlaying, setSegmentIsPlaying] = useState<boolean>(false);
  const [preferredStartTime, setPreferredStartTime] = useState<number | undefined>(undefined);
  const [playerStartDebounce, setPlayerStartDebounce] = useState<Date | undefined>();

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


  const handleTextChange = (text: string) => {
    setSegment({
      ...segment,
      text
    });
  };

  const handleStartChange = (newStart: number) => {
    const end = newStart >= segment.endMS ? newStart + 1000 : segment.endMS
    setSegment({
      ...segment,
      startMS: newStart,
      endMS: end
    });
  };

  const handleEndChange = (newEnd: number) => {
    setSegment({
      ...segment,
      endMS: newEnd
    });
    setPreferredStartTime(newEnd - 1000);
    setPlayerStartDebounce(new Date())
  };

  return (
    <>
      <Player src={audioURL(segment)}
              duration={{startSec: segment.startMS, endSec: segment.endMS}}
              playing={segmentIsPlaying}
              onPlayerStateChanged={setSegmentIsPlaying}
              preferredStartTime={preferredStartTime}
      />

      <TimeInput label="Start" onChange={handleStartChange} value={segment.startMS}/>
      {
        previousSegmentEnd &&
        <Button onClick={() => handleStartChange(previousSegmentEnd)}>
          Align Start to Previous Segment End: {msToHumanReadable(previousSegmentEnd)}
        </Button>
      }
      <TimeInput label="End" onChange={handleEndChange} value={segment.endMS}/>
      {nextSegmentStart &&
      <Button onClick={() => handleEndChange(nextSegmentStart)}>
        Align End to Next Segment Start: {msToHumanReadable(nextSegmentStart)}
      </Button>
      }

      <TextField margin="normal"
                 value={segment.text} fullWidth={true}
                 multiline={true}
                 onChange={(event) => handleTextChange(event.target.value)}/>

    </>
  );
}

