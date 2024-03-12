import React from 'react';
import '@fontsource/roboto';
import {ThemeProvider} from '@mui/material/styles';
import {BrowserRouter as Router} from "react-router-dom";
import {CoreApp, theme} from "./Layout/CoreApp";
import {EventHistoryProvider} from "./App/useServerInteractionHistory";
import {BackendAPIProvider} from "./App/useBackendAPI";


function App() {
  return (
    <EventHistoryProvider>
      <BackendAPIProvider>
        <Router>
          <ThemeProvider theme={theme}>
            <CoreApp/>
          </ThemeProvider>
        </Router>
      </BackendAPIProvider>
    </EventHistoryProvider>
  );
}

export default App;
