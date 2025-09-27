import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">Salsabila</Link>
        <div className="flex items-center gap-4">
          {user?.role === 'GURU' && <Link to="/guru" className="text-sm text-gray-700 hover:text-black">Dashboard Guru</Link>}
          {user?.role === 'WALI_MURID' && <Link to="/wali" className="text-sm text-gray-700 hover:text-black">Dashboard Wali</Link>}
          {!user && (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/register" className="text-sm">Register</Link>
            </>
          )}
          {user && (
            <button onClick={handleLogout} className="px-3 py-1 rounded bg-gray-900 text-white text-sm">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}

