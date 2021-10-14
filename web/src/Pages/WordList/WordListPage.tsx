import React, {useEffect, useState} from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import {useRouteMatch} from "react-router";
import useFetch from "use-http";
import LinkIcon from '@material-ui/icons/Link';
import {SuzukiButton} from "../../VocabularyPractice/SuzukiButton";
import {WordMoraSVG} from "../../VocabularyPractice/MoraSVG";
import {Loadable} from "../../App/loadable";
import {WordList} from "../../App/api";


function CategoryPage() {
  const match = useRouteMatch<{ id: string }>();
  const [wordListData, setWordListData] = useState<Loadable<WordList>>("loading");

  const {get, response} = useFetch<WordList>('/api/wordlists/' + match.params.id);

  async function initialize() {
    const wordList = await get('');
    if (response.ok) {
      setWordListData({
        data: wordList
      });
    }
  }

  useEffect(() => {
    initialize()
  }, [match.params.id]);

  if (wordListData === "loading") {
    return <></>
  }

  const wordList = wordListData.data;

  return (
    <Box m={2}>
      <Container maxWidth='lg'>

        <Box paddingY={2} margin={0}>
          <Typography variant="h2">
            {wordList.name}
          </Typography>
        </Box>

        <Box paddingY={2}>
          <Card>
            <CardContent>
              <Typography variant="h4">
                Practice Items
              </Typography>
              <SuzukiButton text="Open all in Suzuki-kun" items={wordList.words.map(w => w.word)}/>
              <List subheader={<li/>}>
                {wordList.words.map((item, i) =>
                  <ListItem key={`item-${i}`}>
                    <ListItemText
                      secondary={
                        <>
                          <Typography variant="h5" component="span">{item.word}</Typography>
                          <Typography variant="body1" component="span">{item.shiki}式</Typography>
                        </>
                      }
                      primary={<WordMoraSVG word={item}/>}
                    />
                    <ListItemSecondaryAction>
                      <Button
                        startIcon={<LinkIcon/>}
                        aria-label="forvo" href={item.link} target="_blank"
                        variant="contained"
                        color="secondary"
                      >
                        Forvo
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>)}

              </List>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default CategoryPage;
