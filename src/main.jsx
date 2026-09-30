import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

// ✅ Sentry Initialization using .env variable
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN, // ⬅️ Use environment variable
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
