import React from "react";
import {Box, Breadcrumbs, Container, Link, Typography} from "@material-ui/core";


function HomePage() {
  return (
    <Box m={2}>
      <Container maxWidth='lg'>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Home
          </Link>
        </Breadcrumbs>

        <Box paddingY={2} margin={0}>
          <Typography variant="h2">
            Japanese Accent Practice
          </Typography>


          <Box paddingY={2} width={1 / 3}>
            <Typography variant="h4">
              Welcome!
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;
