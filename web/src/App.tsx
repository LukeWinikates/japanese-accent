import React from 'react';
import '@fontsource/roboto';
import './App.css';
import {ThemeProvider} from '@material-ui/core/styles';
import {BrowserRouter as Router} from "react-router-dom";
import {CoreApp, theme} from "./Layout/CoreApp";
import {EventHistoryProvider, useServerInteractionHistory} from "./Status/useServerInteractionHistory";

function App() {
  useServerInteractionHistory();

  return (
    <EventHistoryProvider>
      <Router>
        <ThemeProvider theme={theme}>
          <CoreApp/>
        </ThemeProvider>
      </Router>
    </EventHistoryProvider>
  );
}

export default App;
