import React, {useEffect, useState} from "react";
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Container,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography
} from "@material-ui/core";
import {Recorder} from "./Recorder";
import {useRouteMatch} from "react-router";
import {CategoryDetails} from "./api";
import useFetch from "use-http";
import LinkIcon from '@material-ui/icons/Link';

type CategoryPageParams = string[];

type MoraProps = {
  mora: string,
  accented: boolean,
}

const useStyles = makeStyles((theme) => ({
  accented: {
    borderTop: "2px dotted black"
  },
  default: {}
}));

function Mora({mora, accented}: MoraProps) {
  const classes = useStyles();

  return (<span className={accented ? classes.accented : classes.default}>{mora}</span>);
}

function CategoryPage() {
  const match = useRouteMatch<CategoryPageParams>();
  const segments = match.params[0].split("/");
  const title = segments[segments.length - 1];

  const [category, setCategory] = useState<CategoryDetails | null>(null);

  const {get, post, response, loading, error} = useFetch('/api/categories/' + encodeURIComponent(title));

  async function initialize() {
    const initialCategory = await get('');
    if (response.ok) setCategory(initialCategory)
  }

  useEffect(() => {
    initialize()
  }, [title]);


  console.log(segments);

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


          <Box paddingY={2} width={1 / 3}>
            <Typography variant="h4">
              Recordings
            </Typography>
            <Box paddingY={2}>
              <Recorder/>
            </Box>
          </Box>
        </Box>


        <Box paddingY={2} width={3 / 4}>
          <Card>
            <CardContent>
              <Typography variant="h4">
                Practice Items
              </Typography>
              <List subheader={<li/>}>
                {category?.words.map((item, i) =>
                  <ListItem key={`item-${i}`}>
                    <ListItemText>
                      {
                        item.morae.map((m, i) =>
                          <Mora key={i} mora={m} accented={(item.accentMora ? item.accentMora : 1) === i + 1}/>
                        )
                      }
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton edge={false} aria-label="forvo" href={item.link} target="_blank">
                        <LinkIcon/>
                        <ListItemText>Forvo</ListItemText>
                      </IconButton>
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
