import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { AppConfigProvider } from './context/AppConfigContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppConfigProvider>
      <App />
    </AppConfigProvider>
  </React.StrictMode>
);


