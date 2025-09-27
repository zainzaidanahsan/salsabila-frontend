import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      await login({ token, user });
      if (user?.role === 'GURU') navigate('/guru');
      else if (user?.role === 'WALI_MURID') navigate('/wali');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Selamat Datang Kembali
          </h1>
          <p className="text-gray-600 mt-2">Masuk untuk melanjutkan ke dashboard</p>
        </div>

        <div className="bg-white/80 backdrop-blur border border-blue-100 shadow-xl shadow-blue-100/50 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200/50 px-4 py-2.5 outline-none transition"
                placeholder="nama@contoh.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200/50 px-4 py-2.5 outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold py-2.5 shadow-lg shadow-emerald-200/50 hover:from-blue-700 hover:to-emerald-700 transition"
            >
              Masuk
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun? <a href="/register" className="text-emerald-700 hover:underline">Daftar</a>
        </p>
      </div>
    </div>
  );
}
