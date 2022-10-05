import React, {useEffect, useState} from "react";
import {Box, Breadcrumbs, Container, Link as BreadcrumbLink, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {WordList} from "../../App/api";
import {Loadable} from "../../App/loadable";
import {WordListList} from "./WordListList";
import {useServerInteractionHistory} from "../../Layout/useServerInteractionHistory";
import {wordListsGET} from "../../App/ApiRoutes";

export default function WordListsIndexPage() {
  const {logError} = useServerInteractionHistory();

  const [wordLists, setWordLists] = useState<Loadable<WordList[]>>("loading");

  useEffect(() => {
    wordListsGET()
      .then(r => setWordLists({data: r.data}))
      .catch(() => logError("unable to load wordlists"))
  }, [logError]);

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