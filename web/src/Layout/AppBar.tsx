import {AppBar as MuiAppBar, Badge, CircularProgress, IconButton, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import NotificationsIcon from '@material-ui/icons/Notifications';
import {useServerInteractionHistory} from "./useServerInteractionHistory";
import {Link} from "react-router-dom";

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
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
  offset: theme.mixins.toolbar,
}));

export function AppBar({handleDrawerOpen}: { handleDrawerOpen: () => void }) {
  const classes = useStyles();
  const {events, pendingHttpRequests} = useServerInteractionHistory();
  const hasPendingRequest = pendingHttpRequests > 0;

  return (
    <>
      <MuiAppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                      onClick={handleDrawerOpen}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link to={`/`} className={classes.link}>
              Japanese Accent Practice
            </Link>
          </Typography>
          {hasPendingRequest && <CircularProgress color="inherit" size={18}/>}
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <Badge badgeContent={events.length} color="secondary">
              <NotificationsIcon/>
            </Badge>
          </IconButton>
        </Toolbar>
      </MuiAppBar>
      <div className={classes.offset}/>
    </>
  );
}
