import React from 'react';
import {render, screen} from '@testing-library/react';
import {CoreApp, theme} from './CoreApp';
import {defaultValue, ServerInteractionHistoryContext} from "../App/useServerInteractionHistory";
import {BackendAPIContext} from "../App/useBackendAPI";
import {BrowserRouter as Router} from "react-router-dom";
import {StyledEngineProvider, ThemeProvider} from "@mui/material/styles";
import {NewApiClient} from "../api/client";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {act} from 'react-dom/test-utils';

test('renders learn react link', async () => {
  let axiosInstance = axios.create({});
  let mock = new MockAdapter(axiosInstance)
  mock.onGet("/api/highlights").reply(200, {
    videos: [],
    wordLists: []
  });

  await act(async () => {
      render(
        <ServerInteractionHistoryContext.Provider value={defaultValue}>
          <BackendAPIContext.Provider value={NewApiClient(axiosInstance)}>
            <Router>
              <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                  <CoreApp/>
                </ThemeProvider>
              </StyledEngineProvider>
            </Router>
          </BackendAPIContext.Provider>
        </ServerInteractionHistoryContext.Provider>
      );
    }
  );

  const linkElement = screen.getByText(/Add YouTube video/i);
});
