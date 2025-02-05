import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Profile from './pages/profile.jsx';
import OAuthCallback from './pages/OAuthCallback.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/callback" element={<OAuthCallback />} />
      </Routes>
    </Router>
  </StrictMode>
);
