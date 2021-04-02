import React, {useEffect, useState} from 'react';
import '@fontsource/roboto';
import './App.css';
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {
  AppBar, Box, Breadcrumbs, Card, CardContent,
  Checkbox,
  Container,
  IconButton, Link,
  List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText,
  Toolbar,
  Typography
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import DeleteIcon from '@material-ui/icons/Delete'
import {Recorder} from "./Recorder";
import useFetch from "use-http";
import {Category} from "./api";
import {AppDrawer} from "./AppDrawer";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#006c4f"
    },
    secondary: {
      main: "#b35937"
    }
  }
});

const items = [
  "おもちゃ",
  "研究",
  "靴",
  "雰囲気",
  "背広",
  "ネクタイ"
];


function handleClick() {

}


function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const {get, post, response, loading, error} = useFetch('/categories');

  async function initialize() {
    const initialCategories = await get('');
    if (response.ok) setCategories(initialCategories)
  }

  useEffect(() => {
    initialize()
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} disableGutters={true}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                        onClick={handleDrawerOpen}>
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Japanese Accent Practice
            </Typography>
            {/*<Button color="inherit">Login</Button>*/}
          </Toolbar>
        </AppBar>
        <AppDrawer categories={categories} open={open} handleClose={handleDrawerClose} theme={theme} />
        <Box m={2}>
          <Container maxWidth='lg'>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/" onClick={handleClick}>
                /#
              </Link>
              <Link color="inherit" href="/getting-started/installation/" onClick={handleClick}>
                えほん
              </Link>
              <Typography color="textPrimary"> とうさん まいご （五味太郎）</Typography>
            </Breadcrumbs>

            <Box paddingY={2} margin={0}>
              <Typography variant="h2">
                とうさん まいご （五味太郎）
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
                    {items.map((item, i) =>
                      <ListItem key={`item-${i}`}>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            // checked={checked.indexOf(value) !== -1}
                            tabIndex={-1}
                            disableRipple
                            // inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={item}/>
                        <ListItemSecondaryAction>
                          <IconButton edge={false} aria-label="delete">
                            <DeleteIcon/>
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>)}

                  </List>
                </CardContent>
              </Card>
            </Box>
          </Container>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
