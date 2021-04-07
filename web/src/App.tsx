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
        <AppDrawer categories={categories} open={open} handleClose={handleDrawerClose} theme={theme}/>
        <CategoryPage />
      </Container>
    </ThemeProvider>
  );
}

export default App;
