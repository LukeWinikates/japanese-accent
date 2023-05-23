import {createTheme} from "@mui/material/styles";
import {makeStyles} from 'tss-react/mui';
import React, {useCallback, useState} from "react";
import {Container} from "@mui/material";
import {AppBar} from "./AppBar";
import {AppDrawer} from "./AppDrawer";
import {Routes} from "./Routes";
import {HistoryDrawer} from "./HistoryDrawer";
import {useServerInteractionHistory} from "../App/useServerInteractionHistory";

const useStyles = makeStyles()((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export const theme = createTheme({
  palette: {
    primary: {
      main: "#006c4f"
    },
    secondary: {
      main: "#b35937"
    }
  }
});

export function CoreApp() {
  const {classes} = useStyles();
  const [isNavigationDrawerOpen, setNavigationDrawerOpen] = useState(false);
  const [isHistoryDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const {events} = useServerInteractionHistory().state;

  const onNavigationDrawerOpen = useCallback(() => {
    setNavigationDrawerOpen(true);
  }, [setNavigationDrawerOpen]);

  const onNavigationDrawerClose = useCallback(() => {
    setNavigationDrawerOpen(false);
  }, [setNavigationDrawerOpen]);

  const onHistoryDrawerOpen = useCallback(() => {
    setHistoryDrawerOpen(true);
  }, [setHistoryDrawerOpen]);

  const onHistoryDrawerClose = useCallback(() => {
    setHistoryDrawerOpen(false);
  }, [setHistoryDrawerOpen]);

  return (
    <Container maxWidth={false} disableGutters={true}>
      <AppBar
        onLeftDrawerOpen={onNavigationDrawerOpen}
        onRightDrawerOpen={onHistoryDrawerOpen}
      />
      <main className={classes.content}>
        <AppDrawer
          open={isNavigationDrawerOpen}
          onClose={onNavigationDrawerClose}
        />
        <Routes/>
        <HistoryDrawer
          open={isHistoryDrawerOpen}
          onClose={onHistoryDrawerClose}
          history={events}
        />
      </main>
    </Container>
  );
}