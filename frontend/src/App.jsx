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

function RedirectIfAuthed({ children }) {
  const { user } = useAuth();
  if (user?.role === 'GURU') return <Navigate to="/guru" replace />;
  if (user?.role === 'WALI_MURID') return <Navigate to="/wali" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={
            <RedirectIfAuthed>
              <Login />
            </RedirectIfAuthed>
          } />
          <Route path="/register" element={
            <RedirectIfAuthed>
              <Register />
            </RedirectIfAuthed>
          } />
          <Route path="/guru" element={
            <PrivateRoute roles={["GURU"]}>
              <>
                <Navbar />
                <div className="py-6">
                  <DashboardGuru />
                </div>
              </>
            </PrivateRoute>
          } />
          <Route path="/wali" element={
            <PrivateRoute roles={["WALI_MURID"]}>
              <>
                <Navbar />
                <div className="py-6">
                  <DashboardWali />
                </div>
              </>
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}
