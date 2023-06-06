import React, {useCallback} from "react";
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
} from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import {SuzukiButton} from "../../VocabularyPractice/SuzukiButton";
import {WordMoraSVG} from "../../VocabularyPractice/MoraSVG";
import {WordList} from "../../api/types";
import {useParams} from "react-router-dom";
import {useBackendAPI} from "../../App/useBackendAPI";
import {Loader, Settable} from "../../App/Loader";

function LoadedPage({value}: Settable<WordList>) {
  return (
    <Box m={2}>
      <Container maxWidth='lg'>

        <Box paddingY={2} margin={0}>
          <Typography variant="h2">
            {value.name}
          </Typography>
        </Box>

        <Box paddingY={2}>
          <Card>
            <CardContent>
              <Typography variant="h4">
                Practice Items
              </Typography>
              <SuzukiButton text="Open all in Suzuki-kun" items={value.words.map(w => w.word)}/>
              <List subheader={<li/>}>
                {value.words.map((item, i) =>
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
  )
}

type PageParams = { id: string };

function WordListPage() {
  const {id} = useParams<PageParams>() as PageParams;
  const api = useBackendAPI();
  const callback = useCallback(() => api.wordLists.GET(id), [id, api.wordLists])

  return (
    <Loader
      callback={callback}
      into={LoadedPage}/>
  );
}

export default WordListPage;
