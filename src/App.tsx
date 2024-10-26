import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Maintenance from './pages/Maintenance';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import PatientDetails from './pages/PatientDetails';
import AddPatient from './pages/AddPatient';
import DischargePatient from './pages/DischargePatient';
import Layout from './components/layout/Layout';

// Temporary auth check until system is back online
const isAuthenticated = true;

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated ? <>{children}</> : <Navigate to="/maintenance" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated ? <>{children}</> : <Navigate to="/maintenance" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/welcome" element={<Landing />} />
        <Route path="/maintenance" element={<Maintenance />} />
        
        {/* Redirect auth routes to maintenance */}
        <Route path="/login" element={<Navigate to="/maintenance" />} />
        <Route path="/admin-login" element={<Navigate to="/maintenance" />} />
        <Route path="/forgot-password" element={<Navigate to="/maintenance" />} />
        <Route path="/change-password" element={<Navigate to="/maintenance" />} />
        <Route path="/profile" element={<Navigate to="/maintenance" />} />

        {/* Admin routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <Layout>
              <Admin />
            </Layout>
          </AdminRoute>
        } />

        {/* Private routes */}
        <Route path="/" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/patients/:id" element={
          <PrivateRoute>
            <Layout>
              <PatientDetails />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/add-patient" element={
          <PrivateRoute>
            <Layout>
              <AddPatient />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/discharge/:id" element={
          <PrivateRoute>
            <Layout>
              <DischargePatient />
            </Layout>
          </PrivateRoute>
        } />

        {/* Redirect root to welcome */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </Router>
  );
}