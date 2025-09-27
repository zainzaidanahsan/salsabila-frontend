import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function DashboardWali() {
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

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Wali</h1>

      <section className="bg-white border rounded p-4">
        <h2 className="font-medium mb-3">Cari Nilai Anak</h2>
        <div className="flex gap-3">
          <input placeholder="Masukkan Murid ID" value={muridId} onChange={(e)=>setMuridId(e.target.value)} className="border rounded px-3 py-2 flex-1" />
          <button onClick={fetchNilai} className="bg-blue-600 text-white rounded px-4">Lihat</button>
        </div>
        {message && <p className="text-sm mt-3">{message}</p>}
      </section>

      <section className="bg-white border rounded p-4">
        <h2 className="font-medium mb-3">Nilai</h2>
        <ul className="list-disc pl-6 space-y-1">
          {nilai.map((n, idx)=> (
            <li key={idx}>{n.mapel}: {n.nilai}</li>
          ))}
          {nilai.length === 0 && <li className="list-none text-gray-500">Belum ada nilai</li>}
        </ul>
      </section>
    </div>
  );
}

