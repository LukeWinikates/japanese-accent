import {AppBar as MuiAppBar, IconButton, Toolbar, Typography} from "@material-ui/core";
import {StatusBar} from "./StatusBar";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

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
}));

export function AppBar({handleDrawerOpen}: { handleDrawerOpen: () => void }) {
  const classes = useStyles();

  return <>
    <MuiAppBar position="fixed">
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
    </MuiAppBar>
    <div className={classes.offset}/>
  </>;
}
