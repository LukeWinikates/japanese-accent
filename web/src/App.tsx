import React, {useEffect, useState} from 'react';
import '@fontsource/roboto';
import './App.css';
import {makeStyles, ThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme} from '@material-ui/core/styles';
import {AppBar, Container, IconButton, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import useFetch from "use-http";
import {CategoriesResponse} from "./api";
import {AppDrawer, DummyDrawer} from "./Layout/AppDrawer";
import CategoryPage from "./VocabularyPractice/CategoryPage";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import HomePage from "./Layout/HomePage";
import {StatusBar, StatusProvider, useStatus} from "./Layout/StatusBar";
import {YoutubeVideoPage} from "./MediaPractice/YoutubeVideoPage";

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
  offset: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
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

function CoreApp() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [categoriesResponse, setCategoriesResponse] = useState<CategoriesResponse | null>(null);
  const {setter: setStatus} = useStatus();

  const {get, response, loading, error} = useFetch('/api/categories');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  async function initialize() {
    setStatus({
      spinner: true,
      error: null
    });
    const initialCategories = await get('');
    if (response.ok) setCategoriesResponse(initialCategories);
    let status = {
      spinner: loading,
      error: response.ok ? null : {
        message: error ? error.message : "unknown error",
        seen: false,
      }
    };
    setStatus(status);
  }

  useEffect(() => {
    initialize()
  }, []);

  let Drawer = <DummyDrawer/>

  if (categoriesResponse !== null) {
    Drawer = <AppDrawer categories={categoriesResponse} open={open} handleClose={handleDrawerClose} theme={theme}/>
  }

  return (
    <Container maxWidth={false} disableGutters={true}>
      <AppBar position="fixed">
        <StatusBar/>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                      onClick={handleDrawerOpen}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Japanese Accent Practice
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.offset}/>
      <main className={classes.content}>
        {Drawer}
        <Switch>
          <Route exact path="/">
            <HomePage/>
          </Route>
          <Route path="/category/*">
            <CategoryPage/>
          </Route>
          <Route path="/media/*">
            <YoutubeVideoPage/>
          </Route>
        </Switch>
      </main>
    </Container>
  );
}

function App() {
  return (
    <StatusProvider>
      <Router>
        <ThemeProvider theme={theme}>
          <CoreApp/>
        </ThemeProvider>
      </Router>
    </StatusProvider>
  );
}

export default App;
