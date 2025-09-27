import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DashboardGuru from './pages/DashboardGuru.jsx';
import DashboardWali from './pages/DashboardWali.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/guru" element={
            <PrivateRoute roles={["GURU"]}>
              <DashboardGuru />
            </PrivateRoute>
          } />
          <Route path="/wali" element={
            <PrivateRoute roles={["WALI_MURID"]}>
              <DashboardWali />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

