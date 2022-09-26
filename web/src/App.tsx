import React from 'react';
import '@fontsource/roboto';
import './App.css';
import {StyledEngineProvider, Theme, ThemeProvider} from '@mui/material/styles';
import {BrowserRouter as Router} from "react-router-dom";
import {CoreApp, theme} from "./Layout/CoreApp";
import {EventHistoryProvider, useServerInteractionHistory} from "./Layout/useServerInteractionHistory";


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


function App() {
  useServerInteractionHistory();

  return (
    <EventHistoryProvider>
      <Router>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CoreApp/>
          </ThemeProvider>
        </StyledEngineProvider>
      </Router>
    </EventHistoryProvider>
  );
}

export default App;
