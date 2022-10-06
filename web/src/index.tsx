import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

createRoot(document.getElementById('root')!)
  .render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>
  );

// see: https://create-react-app.dev/docs/measuring-performance/#sending-results-to-analytics
function sendToAnalytics(metric: any) {
  const body = JSON.stringify(metric);
  const url = '/analytics';

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, {body, method: 'POST', keepalive: true});
  }
}

reportWebVitals(sendToAnalytics);
