import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import SessionInvalidatedModal from './components/SessionInvalidatedModal';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import PendingApproval from './pages/PendingApproval';
import AudioWorkspace from './pages/AudioWorkspace';
import AnalysisDetails from './pages/AnalysisDetails';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import ApiLogs from './pages/ApiLogs';
import AnalyticsPricing from './pages/AnalyticsPricing';

import './styles/index.css';

function MainLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/pending-approval'].includes(location.pathname);

  return (
    <div className="app-container">
      {/* Ambient Dynamic Background Orbs for Glassmorphism */}
      <div className="ambient-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Render Sidebar when logged in or on app pages; Floating ThemeToggle on Auth Pages */}
      {user && !isAuthPage ? (
        <Sidebar />
      ) : (
        <div style={{ position: 'fixed', top: '1.5rem', right: '2rem', zIndex: 60 }}>
          <ThemeToggle />
        </div>
      )}

      <SessionInvalidatedModal />

      <main className="main-content" style={{ justifyContent: isAuthPage ? 'center' : 'flex-start', alignItems: isAuthPage ? 'center' : 'stretch' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AudioWorkspace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis/:id"
            element={
              <ProtectedRoute>
                <AnalysisDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <ApiLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPricing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <MainLayout />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
