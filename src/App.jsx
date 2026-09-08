import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layout
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AllTeams from './pages/AllTeams';
import ShortlistedTeams from './pages/ShortlistedTeams';
import OnGroundCheckin from './pages/OnGroundCheckin';
import AttendanceTracker from './pages/AttendanceTracker';
import FinalSelection from './pages/FinalSelection';
import CheckedInTeams from './pages/CheckedInTeams';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="teams" element={<AllTeams />} />
          <Route path="shortlisted" element={<ShortlistedTeams />} />
          <Route path="checkin" element={<OnGroundCheckin />} />
          <Route path="checkedin-list" element={<CheckedInTeams />} />
          <Route path="attendance" element={<AttendanceTracker />} />
          <Route path="finals" element={<FinalSelection />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
