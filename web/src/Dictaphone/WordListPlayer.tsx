import {Word} from "../api/types";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {Box, Card, CardContent, LinearProgress, List, ListItemButton, Typography} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import {WithIndex} from "../App/WithIndex";
import {WordAnalysisLoader} from "./WordAnalysisLoader";

type AudioLinkPlayerProps = { words: Word[] };

function Item({index, word, selected, onClick}: { index: number, word: Word, selected: boolean, onClick: (word: Word, index: number)=>void  }) {
  const callback = useCallback(()=> {
    onClick(word, index)
  }, [word, index, onClick])
  return (
    <ListItemButton key={index}
              selected={selected}
              alignItems="flex-start"
              onClick={callback}
    >
      <ListItemText
        primaryTypographyProps={{noWrap: true, variant: "body2"}}
        primary={word.word}
      >
      </ListItemText>
    </ListItemButton>
  )
}

export const WordListPlayer = ({words}: AudioLinkPlayerProps) => {

  const [currentWord, setCurrentWord] = useState<WithIndex<Word>>({value: words[0], index: 0});

  const pauseAll = useCallback(() => {
    document.querySelectorAll("audio").forEach(a => a.pause());
  }, []);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.querySelectorAll(`li`)[currentWord.index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [currentWord])

  let onClick = useCallback((word: Word, index: number) => {
    pauseAll();
    setCurrentWord({value: word, index});
  },[pauseAll, setCurrentWord]);


  if (words.length === 0) {
    return (
      <Typography>
        No words saved for this video yet.
      </Typography>);
  }

  let wordsProgress = (currentWord.index + 1) / words.length * 100;

  return (
    <Box>
      <Card>
        <LinearProgress variant="determinate" value={wordsProgress}/>
        <CardContent>
          {currentWord &&
          <>
            <Typography>
              #{currentWord.index + 1} / {words.length}
              {currentWord.value.word}
            </Typography>
            <WordAnalysisLoader word={currentWord.value.word}/>
          </>
          }
        </CardContent>
      </Card>
      <Box marginY={2} height='50vh' style={{overflowY: 'scroll'}}>
        <Card ref={listRef}>
          <List>
            {
              words.map((word: Word, index: number) => {
                return (
                 <Item word={word} index={index} onClick={onClick} selected={index === currentWord.index}/>
                );
              })
            }
          </List>
        </Card>
      </Box>
    </Box>
  );
};