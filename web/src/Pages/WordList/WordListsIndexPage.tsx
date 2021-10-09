import React, {useEffect, useState} from "react";
import {Box, Breadcrumbs, Container, Link as BreadcrumbLink, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {WordList} from "../../App/api";
import useFetch from "use-http";
import {Loadable} from "../../App/loadable";
import {WordListList} from "./WordListList";

export default function WordListsIndexPage() {
  const {get, response} = useFetch<WordList[]>(
    "/api/wordlists");
  const [wordLists, setWordLists] = useState<Loadable<WordList[]>>("loading");
  useEffect(() => {
    async function initialize() {
      const wordLists = await get('');
      if (response.ok) {
        setWordLists({data: wordLists});
      }
    }

    initialize();
  }, []);

  return (
    <>
      <Box m={2}>
        <Container maxWidth='lg'>
          <Breadcrumbs aria-label="breadcrumb">
            <BreadcrumbLink color="inherit" href="/">
              Home
            </BreadcrumbLink>
          </Breadcrumbs>

          <Box paddingY={2} margin={0}>
            <Typography variant="h2">
              Japanese Accent Practice
            </Typography>

            <Box paddingY={2} margin={0}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="h4">
                    WordLists
                  </Typography>
                  {
                    wordLists === "loading" ? null :
                      <WordListList wordLists={wordLists.data}/>
                  }
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}