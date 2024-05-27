import {Clip} from "../api/types";
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Box, Card, CardContent, LinearProgress, List} from "@mui/material";
import {Dictaphone} from "./Dictaphone";
import {PitchDetails} from "./PitchDetails";
import {PagingTitle} from "./PagingTitle";
import {Pager} from "./Pager";
import {ExportButton} from "./ExportButton";
import {PlaylistRow} from "./PlaylistRow";
import {Cursor, move, newCursor, setValue} from "../App/collection";

type PlaylistPlayerProps = { clips: Clip[], onClipsChange: (clips: Clip[]) => void, parentId: string };

export const PlaylistPlayer = ({clips, onClipsChange, parentId}: PlaylistPlayerProps) => {
    const [currentClip, setCurrentClip] = useState<Cursor<Clip>>(newCursor(clips));
    const clipProgress = (currentClip.index + 1) / clips.length * 100;

    const pauseAll = useCallback(() => {
      document.querySelectorAll("audio").forEach(a => a.pause());
    }, []);

    useEffect(() => {
      setCurrentClip(newCursor(clips))
    }, [parentId, clips]);

    const listRef = useRef<HTMLDivElement>(null!);

    useLayoutEffect(() => {
      listRef.current?.querySelectorAll(`li`)[currentClip.index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, [currentClip.index])

    const onPauseAndSetNewCurrentClip = useCallback((index: number) => {
      pauseAll();
      setCurrentClip(move(currentClip, index))
    }, [setCurrentClip, pauseAll, currentClip])

    const onUpdateClip = useCallback((clip: Clip) => {
      setCurrentClip(setValue(currentClip, clip));
      onClipsChange(currentClip.collection);
    }, [currentClip, onClipsChange]);

    if (!currentClip.value) {
      return <>no current clip</>
    }

    return (
      <>
        <Card>
          <LinearProgress variant="determinate" value={clipProgress}/>
          <CardContent>
            <PagingTitle
              clip={currentClip.value}
              currentClipIndex={currentClip.index}
              clips={clips}
              setClipByIndex={onPauseAndSetNewCurrentClip}
            />
            <PitchDetails clip={currentClip.value}
                          updateClip={onUpdateClip}/>
            <Dictaphone item={currentClip.value}/>
            <Pager currentIndex={currentClip.index}
                   maxIndex={clips.length - 1}
                   setByIndex={onPauseAndSetNewCurrentClip}/>
            <ExportButton parentId={parentId}/>
          </CardContent>
        </Card>
        <Box marginY={2} height='50vh' style={{overflowY: 'scroll'}}>
          <Card ref={listRef}>
            <List>
              {
                clips.map((clip: Clip, index: number) => {
                  return <PlaylistRow
                    key={index}
                    clip={clip}
                    index={index}
                    onSelectClip={onPauseAndSetNewCurrentClip}
                    isCurrent={index === currentClip.index}/>
                })
              }
            </List>
          </Card>
        </Box>
      </>
    );
  }
;