import {adaptV4Theme, unstable_createMuiStrictModeTheme as createMuiTheme} from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import React, {useState} from "react";
import {Container} from "@mui/material";
import {AppBar} from "./AppBar";
import {AppDrawer} from "./AppDrawer";
import {Routes} from "./Routes";

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));
export const theme = createMuiTheme(adaptV4Theme({
  palette: {
    primary: {
      main: "#006c4f"
    },
    secondary: {
      main: "#b35937"
    }
  }
}));

export function CoreApp() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth={false} disableGutters={true}>
      <AppBar handleDrawerOpen={handleDrawerOpen}/>
      <main className={classes.content}>
        <AppDrawer open={open} handleClose={handleDrawerClose}/>
        <Routes/>
      </main>
    </Container>
  );
}