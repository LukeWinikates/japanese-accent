import React from 'react';
import '@fontsource/roboto';
import {StyledEngineProvider, ThemeProvider} from '@mui/material/styles';
import {BrowserRouter as Router} from "react-router-dom";
import {CoreApp, theme} from "./Layout/CoreApp";
import {EventHistoryProvider} from "./App/useServerInteractionHistory";
import {BackendAPIProvider} from "./App/useBackendAPI";


function App() {
  return (
    <EventHistoryProvider>
      <BackendAPIProvider>
        <Router>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CoreApp/>
            </ThemeProvider>
          </StyledEngineProvider>
        </Router>
      </BackendAPIProvider>
    </EventHistoryProvider>
  );
}

export default App;
