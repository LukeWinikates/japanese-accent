import React, {useEffect, useRef, useState} from "react";
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
  useTheme
} from "@material-ui/core";
import {Recorder} from "./Recorder";
import {useRouteMatch} from "react-router";
import {CategoryDetails, Word} from "./api";
import useFetch from "use-http";
import LinkIcon from '@material-ui/icons/Link';

type CategoryPageParams = string[];

function moraAccentHigh(word: Word, index: number) {
  if (!!word.accentMora) {
    if (index === 0 && word.accentMora !== 1) {
      return false;
    }

    return index + 1 <= word.accentMora;
  } else {
    // heiban starts low, the rest are high
    return index > 0;
  }
}

function MoraSVG({word}: {
  word: Word
}) {
  const theme = useTheme();
  const moraWidth = 40;
  const high = 10;
  const low = 30;

  const points = word.morae.map((m, i) => {
    const x = 20 + (i * moraWidth);
    const y = moraAccentHigh(word, i) ? high : low;
    return {x, y}
  });


  const path = points.map(({x, y}, i) => `${i === 0 ? "M" : "L"} ${x},${y}`).join("\n");

  return (
    <svg style={{display: "inline-block", width: 8 * moraWidth, height: 80}}>

      {
        points.map((p, i) => {
          return <circle key={`point-${i}`} cx={p.x} cy={p.y} r="5" fill={theme.palette.primary.light}/>
        })
      }
      <path fill="none" stroke={theme.palette.primary.light} strokeWidth={2} d={path}/>

      {
        word.morae.map((m, i) => {
          return (
            <text y="60"
                  style={{
                    fill: i + 1 === word.accentMora ? theme.palette.primary.light : theme.palette.grey["700"],
                    fontWeight: i + 1 === word.accentMora ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                    fontSize: 16,
                    textAlign: "center"
                  }}
                  key={`text-${i}`}
                  x={`${i * moraWidth + 10}`}>
              {m}
            </text>);
        })
      }
    </svg>
  );
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

  const formEl = useRef<HTMLFormElement>(null);

  const submitForm = () => {
    formEl.current?.submit();
  };

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

          <form action={category?.suzukiKunAction} method="post" target="_blank" ref={formEl}>
            <input type="hidden"
                   value={category?.words.map(w => w.word).join("\n") || ""}
                   name="data[Phrasing][text]"
            />

            {
              Object.entries({
                "curve": "advanced",
                "accent": "advanced",
                "accent_mark": "all",
                "estimation": "crf",
                "analyze": "true",
                "phrase_component": "invisible",
                "param": "invisible",
                "subscript": "visible",
                "jeita": "invisible",
              }).map(([k, v]) => {
                return (<input type="hidden"
                               key={k}
                               value={v}
                               name={`data[Phrasing][${k}]`}
                />)
              })
            }
            <Button onClick={submitForm} startIcon={<LinkIcon/>} variant="contained"
                    color="secondary">

              Open All in Suzuki-Kun
            </Button>
          </form>

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
