import React, {useEffect, useState} from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import {useRouteMatch} from "react-router";
import {CategoryDetails} from "../api";
import useFetch from "use-http";
import LinkIcon from '@material-ui/icons/Link';
import {SuzukiButton} from "./SuzukiButton";
import {MoraSVG} from "./MoraSVG";

type CategoryPageParams = string[];
type Loading = { loading: true };
type Loaded = { loading: false, category: CategoryDetails };
type CategoryPageState = Loading | Loaded;

function CategoryPage() {
  const match = useRouteMatch<CategoryPageParams>();
  const segments = match.params[0].split("/");
  const title = segments[segments.length - 1];

  const [pageState, setPageState] = useState<CategoryPageState>({loading: true});

  const {get, response} = useFetch<CategoryDetails>('/api/categories/' + encodeURIComponent(title));

  async function initialize() {
    const initialCategory = await get('');
    if (response.ok) {
      setPageState({
        loading: false,
        category: initialCategory
      });
    }
  }

  useEffect(() => {
    initialize()
  }, [title]);

  if (pageState.loading) {
    return (<>loading</>);
  }

  const {category} = pageState;

  return (
    <Box m={2}>
      <Container maxWidth='lg'>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            #
          </Link>
          {
            segments.map((tag, i) => {
                const selfLink = segments.slice(0, i + 1).join('/');
                return (<Link color="inherit" href={`/category/${selfLink}`} key={i}>
                  {tag}
                </Link>);
              }
            )
          }
        </Breadcrumbs>

        <Box paddingY={2} margin={0}>
          <Typography variant="h2">
            {title}
          </Typography>
        </Box>

        <Box paddingY={2}>
          <Card>
            <CardContent>
              <Typography variant="h4">
                Practice Items
              </Typography>
              <SuzukiButton category={category}/>
              <List subheader={<li/>}>
                {category.words.map((item, i) =>
                  <ListItem key={`item-${i}`}>
                    <ListItemText
                      secondary={
                        <>
                          <Typography variant="h5" component="span">{item.word}</Typography>
                          <Typography variant="body1" component="span">{item.shiki}式</Typography>
                        </>
                      }
                      primary={<MoraSVG word={item}/>}
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
