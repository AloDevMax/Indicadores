
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { AuthProvider } from '@/shared/contexts/AuthContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </AuthProvider>
  </React.StrictMode>
);
