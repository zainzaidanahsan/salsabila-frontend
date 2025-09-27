import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('GURU');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    try {
      await api.post('/auth/register', { name, email, password, role });
      setSuccess('Registrasi berhasil, silakan login');
      setTimeout(()=>navigate('/login'), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Buat Akun Baru
          </h1>
          <p className="text-gray-600 mt-2">Daftar untuk mulai menggunakan aplikasi</p>
        </div>

        <div className="bg-white/80 backdrop-blur border border-emerald-100 shadow-xl shadow-blue-100/50 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200/50 px-4 py-2.5 outline-none transition"
                placeholder="Nama lengkap"
                required
              />
            </div>
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
                placeholder="Minimal 8 karakter"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e)=>setRole(e.target.value)}
                className="w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200/50 px-4 py-2.5 outline-none transition bg-white"
              >
                <option value="GURU">GURU</option>
                <option value="WALI_MURID">WALI_MURID</option>
              </select>
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                {success}
              </p>
            )}
            <button
              type="submit"
              className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold py-2.5 shadow-lg shadow-blue-200/50 hover:from-emerald-700 hover:to-blue-700 transition"
            >
              Daftar
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun? <a href="/login" className="text-blue-700 hover:underline">Masuk</a>
        </p>
      </div>
    </div>
  );
}
