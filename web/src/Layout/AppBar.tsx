import {AppBar as MuiAppBar, Badge, CircularProgress, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from '@mui/icons-material/Settings';
import React, {useState} from "react";
import {makeStyles} from 'tss-react/mui';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {useServerInteractionHistory} from "./useServerInteractionHistory";
import {Link} from "react-router-dom";
import SettingsDialog from "./SettingsDialog"
import {CSSObject} from "tss-react";

const useStyles = makeStyles()((theme) => ({
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
  offset: theme.mixins.toolbar as CSSObject,
}));

export function AppBar({handleDrawerOpen}: { handleDrawerOpen: () => void }) {
  const {classes} = useStyles();
  const {events, pendingHttpRequests} = useServerInteractionHistory().state;
  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [isHistorySnackBarOpen, setHistorySnackbarOpen] = useState(false);
  const hasPendingRequest = pendingHttpRequests > 0;

  const openSettingsDialog = () => setSettingsDialogOpen(true)
  const openHistorySnackbar = () => setHistorySnackbarOpen(true)

  return <>
    <MuiAppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerOpen}
          size="large">
          <MenuIcon/>
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          <Link to={`/`} className={classes.link}>
            Japanese Accent Practice
          </Link>
        </Typography>
        {hasPendingRequest && <CircularProgress color="inherit" size={18}/>}
        <IconButton
          edge="start"
          className={classes.menuButton}
          onClick={openHistorySnackbar}
          color="inherit"
          aria-label="menu"
          size="large">
          <Badge badgeContent={events.length} color="secondary">
            <NotificationsIcon/>
          </Badge>
        </IconButton>
        <IconButton
          edge="start"
          onClick={openSettingsDialog}
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          size="large">
          <SettingsIcon/>
        </IconButton>
      </Toolbar>
    </MuiAppBar>
    <div className={classes.offset}/>
    {isSettingsDialogOpen && <SettingsDialog onClose={() => setSettingsDialogOpen(false)}/>}
  </>;
}
