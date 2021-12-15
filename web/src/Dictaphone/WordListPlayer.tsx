import {Word} from "../App/api";
import React, {useEffect, useRef, useState} from "react";
import {Box, Card, CardContent, LinearProgress, List, ListItem, Typography} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import {WithIndex} from "../App/WithIndex";
import {PagingDictaphone} from "./PagingDictaphone";
import {ItemsLoader} from "./ItemsLoader";

type AudioLinkPlayerProps = { words: Word[] };

export const WordListPlayer = ({words}: AudioLinkPlayerProps) => {
  const [currentWord, setCurrentWord] = useState<WithIndex<Word>>({value: words[0], index: 0});

  function pauseAll() {
    document.querySelectorAll("audio").forEach(a => a.pause());
  }

  const listRef = useRef<HTMLElement>();

  useEffect(() => {
    listRef.current?.querySelectorAll(`li`)[currentWord.index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [currentWord])

  if (words.length === 0) {
    return (
      <Typography>
        No words saved for this video yet.
      </Typography>);
  }

  let renderRow = (word: Word, index: number) => {
    return (
      <ListItem key={index}
                selected={currentWord.index === index}
                alignItems="flex-start"
                onClick={() => {
                  pauseAll();
                  setCurrentWord({value: word, index});
                }}
      >
        <ListItemText
          primaryTypographyProps={{noWrap: true, variant: "body2"}}
          primary={word.word}
          // secondary={Math.round(duration(segment)) + "s"}
        >
        </ListItemText>
      </ListItem>
    );
  };

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
            <ItemsLoader word={currentWord.value.word}>
              {
                items => <PagingDictaphone items={items.audio}/>
              }
            </ItemsLoader>
          </>
          }
        </CardContent>
      </Card>
      <Box marginY={2} height='50vh' style={{overflowY: 'scroll'}}>
        <Card ref={listRef}>
          <List>
            {
              words.map(renderRow)
            }
          </List>
        </Card>
      </Box>
    </Box>
  );
};