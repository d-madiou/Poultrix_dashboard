import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import LoginPage from './components/auth/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

const RootApp = () => {
  const { isAuthenticated, loading, login } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <App /> : <LoginPage onLogin={login} />;
};

// Mount the React application to the DOM
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found. Make sure an element with id="root" exists in index.html');
}

createRoot(container).render(
  <React.StrictMode>
    <AuthProvider>
      <RootApp />
    </AuthProvider>
  </React.StrictMode>
);