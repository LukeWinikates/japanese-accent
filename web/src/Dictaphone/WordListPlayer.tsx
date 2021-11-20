import {Audio, Word, WordAnalysis} from "../App/api";
import React, {useEffect, useRef, useState} from "react";
import {Box, Card, CardContent, LinearProgress, List, ListItem, Typography} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import {Dictaphone} from "./Dictaphone";
import {WithIndex} from "../App/WithIndex";
import {useFetch} from "use-http";
import {useServerInteractionHistory} from "../Layout/useServerInteractionHistory";
import {Loadable} from "../App/loadable";
import {Pager} from "./Pager";

type AudioLinkPlayerProps = { words: Word[] };

function PagingDictaphone({items}: { items: Audio[] }) {
  const [currentItem, setCurrentItem] = useState<WithIndex<Audio> | null>({
      value: items[0],
      index: 0
    }
  );

  useEffect(() => {
    setCurrentItem({
      value: items[0],
      index: 0
    })
  }, items)

  if (currentItem === null) {
    return <>No items</>;
  }

  const setByIndex = (i: number) => {
    setCurrentItem({
      index: i, value: items[i]
    })
  }

  return (
    <>
      <Typography>
        #{currentItem.index + 1} / {items.length}
        <span role="img"
              aria-label={currentItem.value.speakerGender === "m" ? "male" : "female"}>
          {currentItem.value.speakerGender === "m" ? "👨" : "👩"}
        </span>
        {currentItem.value.speakerUsername}
      </Typography>
      <Dictaphone item={currentItem.value}/>
      <Pager currentIndex={currentItem.index}
             maxIndex={items.length - 1}
             setByIndex={setByIndex}/>
    </>);
}

const ItemsLoader = ({word, children}: { word: string, children: (items: WordAnalysis) => any }) => {
  const {logError} = useServerInteractionHistory();

  const [item, setItem] = useState<Loadable<WordAnalysis>>("loading");
  const {get: getAudio} = useFetch('/api/word-analysis/');
  useEffect(() => {
    getAudio(word).then(analysis => {
      console.log(analysis);
      setItem({data: analysis});
    }).catch(logError);
  }, [word])

  if (item === "loading") {
    return <>Loading...</>
  }

  return (
    <>
      {children(item.data)}
    </>
  );
}

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