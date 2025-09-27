import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

function LineChart({ data, height = 220 }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[220px] grid place-items-center text-gray-400 text-sm">
        Tidak ada data grafik
      </div>
    );
  }

  const padding = 24;
  const width = 720;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const values = data.map((d) => d.y);
  const maxY = Math.max(100, ...values);
  const minY = Math.min(0, ...values);
  const yRange = maxY - minY || 1;

  const points = data.map((d, i) => {
    const x = (i / Math.max(1, data.length - 1)) * innerW + padding;
    const y = height - padding - ((d.y - minY) / yRange) * innerH;
    return { x, y };
  });

  const path = points
    .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
    .join(' ');

  const area = `M ${points[0].x},${height - padding} L ` +
    points.map((p) => `${p.x},${p.y}`).join(' L ') +
    ` L ${points[points.length - 1].x},${height - padding} Z`;

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((t) => {
        const y = height - padding - ((t - minY) / yRange) * innerH;
        return (
          <g key={t}>
            <line x1={padding} x2={width - padding} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="4 4" />
            <text x={8} y={y + 4} fontSize="10" fill="#6b7280">{t}</text>
          </g>
        );
      })}
      <path d={area} fill="url(#g1)" />
      <path d={path} fill="none" stroke="#10b981" strokeWidth="2" />
    </svg>
  );
}

export default function DashboardWali() {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [muridId, setMuridId] = useState('');
  const [nilai, setNilai] = useState([]);
  const [message, setMessage] = useState(null);

  const fetchNilai = async () => {
    if (!muridId) return;
    setMessage(null);
    try {
      const res = await api.get(`/nilai/${muridId}`);
      setNilai(res.data || []);
    } catch (e) {
      setMessage('Gagal memuat nilai');
    }
  };

  useEffect(() => {
    // Optionally preload with a known muridId from user profile, if available
  }, []);

  const chartData = useMemo(() => {
    // expects nilai in format [{mapel, nilai}]
    return (nilai || []).map((n, i) => ({ x: i, y: Number(n.nilai) || 0 }));
  }, [nilai]);

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
        </svg>
      )
    },
    {
      id: 'laporan',
      title: 'Laporan Nilai',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      )
    },
    {
      id: 'profil',
      title: 'Profil Anak',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      )
    },
    {
      id: 'komunikasi',
      title: 'Komunikasi',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      )
    },
    {
      id: 'jadwal',
      title: 'Jadwal Pelajaran',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-emerald-600 to-emerald-700 shadow-xl fixed h-screen top-0 z-40 transition-all duration-300`}>
          <div className={`${sidebarOpen ? 'p-6' : 'p-2'} pt-[88px] transition-all duration-300`}>
            {/* Header with toggle button */}
            {sidebarOpen ? (
              <div className="flex items-center justify-between mb-6">
                <div className="text-white font-semibold text-lg">Menu</div>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                  title="Buka Menu"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
              </div>
            )}

            {/* User Profile Section */}
            {sidebarOpen ? (
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-white">{user?.nama || 'Wali Murid'}</div>
                  <div className="text-emerald-100 text-sm">Dashboard Wali</div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-8">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
            )}

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-2'} py-3 rounded-lg transition-all duration-200 text-left ${
                    activeMenu === item.id
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
                  title={!sidebarOpen ? item.title : ''}
                >
                  {item.icon}
                  {sidebarOpen && <span className="font-medium">{item.title}</span>}
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom Section */}
          {sidebarOpen && (
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-emerald-100 text-xs mb-1">Tahun Ajaran</div>
                <div className="text-white font-semibold">2024/2025</div>
              </div>
            </div>
          )}
        </aside>

        {/* Overlay untuk mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-8 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        }`}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activeMenu === 'dashboard' && 'Dashboard Overview'}
              {activeMenu === 'laporan' && 'Laporan Nilai'}
              {activeMenu === 'profil' && 'Profil Anak'}
              {activeMenu === 'komunikasi' && 'Komunikasi dengan Guru'}
              {activeMenu === 'jadwal' && 'Jadwal Pelajaran'}
            </h1>
            <p className="text-gray-600">
              Selamat datang di dashboard wali murid. Pantau perkembangan anak Anda dengan mudah.
            </p>
          </div>

          {activeMenu === 'dashboard' && (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">85.5</div>
                      <div className="text-gray-600">Rata-rata Nilai</div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">95%</div>
                      <div className="text-gray-600">Kehadiran</div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">12</div>
                      <div className="text-gray-600">Mata Pelajaran</div>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Cari Nilai Anak</h2>
                <div className="flex gap-3">
                  <input
                    placeholder="Masukkan Murid ID"
                    value={muridId}
                    onChange={(e)=>setMuridId(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-3 flex-1 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    onClick={fetchNilai}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg px-6 py-3 font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-sm"
                  >
                    Lihat Nilai
                  </button>
                </div>
                {message && <p className="text-sm mt-3 text-red-600">{message}</p>}
              </section>

              <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Grafik Nilai per Mata Pelajaran</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Skala 0-100</span>
                </div>
                <LineChart data={chartData} />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nilai.map((n, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between hover:shadow-sm transition-shadow">
                      <span className="text-gray-700 font-medium">{n.mapel}</span>
                      <span className={`font-bold text-lg ${
                        n.nilai >= 85 ? 'text-emerald-600' :
                        n.nilai >= 75 ? 'text-blue-600' :
                        n.nilai >= 65 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{n.nilai}</span>
                    </div>
                  ))}
                  {nilai.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-8">
                      <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                      Belum ada data nilai. Silakan masukkan Murid ID untuk melihat nilai.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {/* Content for other menu items */}
          {activeMenu === 'laporan' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Laporan Nilai Lengkap</h2>
              <p className="text-gray-600">Fitur laporan nilai sedang dalam pengembangan.</p>
            </div>
          )}

          {activeMenu === 'profil' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profil Anak</h2>
              <p className="text-gray-600">Fitur profil anak sedang dalam pengembangan.</p>
            </div>
          )}

          {activeMenu === 'komunikasi' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Komunikasi dengan Guru</h2>
              <p className="text-gray-600">Fitur komunikasi sedang dalam pengembangan.</p>
            </div>
          )}

          {activeMenu === 'jadwal' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Jadwal Pelajaran</h2>
              <p className="text-gray-600">Fitur jadwal pelajaran sedang dalam pengembangan.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}