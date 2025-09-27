import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logoImage from '../assets/Slide1.JPG?url';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-100/50 sticky top-0 z-50">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand - Pinned to left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <img
                src={logoImage}
                alt="Salsabila Logo"
                className="h-12 w-auto transition-all duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Navigation Links - Pinned to right */}
          <div className="flex items-center space-x-6 flex-shrink-0">
            {/* Dashboard Links */}
            {user?.role === 'GURU' && (
              <Link
                to="/guru"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span>Dashboard Guru</span>
              </Link>
            )}

            {user?.role === 'WALI_MURID' && (
              <Link
                to="/wali"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-300 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>Dashboard Wali</span>
              </Link>
            )}

            {/* Auth Links for Non-Authenticated Users */}
            {!user && (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-700 font-medium transition-colors duration-300"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* User Info & Logout for Authenticated Users */}
            {user && (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">{user.nama || 'User'}</div>
                    <div className="text-gray-500 text-xs">{user.role === 'GURU' ? 'Guru' : 'Wali Murid'}</div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 group"
                >
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

