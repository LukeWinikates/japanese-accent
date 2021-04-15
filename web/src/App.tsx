import React, {useEffect, useState} from 'react';
import '@fontsource/roboto';
import './App.css';
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {AppBar, Container, IconButton, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import useFetch from "use-http";
import {Category} from "./api";
import {AppDrawer} from "./AppDrawer";
import CategoryPage from "./CategoryPage";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import HomePage from "./HomePage";
import clsx from 'clsx';

const drawerWidth = 440;

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
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
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
    <Router>
      <ThemeProvider theme={theme}>
        <Container maxWidth={false} disableGutters={true}>
          <AppBar position="fixed" className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}>
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
          <main className={clsx(classes.content, {
            [classes.contentShift]: !open,
          })}>
            <AppDrawer categories={categories} open={open} handleClose={handleDrawerClose} theme={theme}/>
            <Switch>
              <Route exact path="/">
                <HomePage/>
              </Route>
              <Route path="/category/*">
                <CategoryPage/>
              </Route>
            </Switch>
          </main>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
