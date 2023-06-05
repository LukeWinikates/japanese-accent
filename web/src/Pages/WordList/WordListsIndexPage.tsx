import React from "react";
import {Box, Breadcrumbs, Container, Link as BreadcrumbLink, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {WordList} from "../../api/types";
import {WordListList} from "./WordListList";
import {useBackendAPI} from "../../App/useBackendAPI";
import {Loader} from "../../App/Loader";

function LoadedContent({value}: { value: WordList[] }) {
  return (
    <WordListList wordLists={value}/>
  )
}

export default function WordListsIndexPage() {
  const api = useBackendAPI();
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
                  <Loader callback={api.wordLists.index.GET}
                          into={LoadedContent}/>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}