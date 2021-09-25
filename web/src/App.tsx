import React from 'react';
import '@fontsource/roboto';
import './App.css';
import {ThemeProvider} from '@material-ui/core/styles';
import {BrowserRouter as Router} from "react-router-dom";
import {CoreApp, theme} from "./Layout/CoreApp";

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CoreApp/>
      </ThemeProvider>
    </Router>
  );
}

export default App;
