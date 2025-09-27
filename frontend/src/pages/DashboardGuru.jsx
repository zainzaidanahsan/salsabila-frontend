import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function DashboardGuru() {
  const [murid, setMurid] = useState([]);
  const [selectedMurid, setSelectedMurid] = useState('');
  const [mapel, setMapel] = useState('');
  const [nilai, setNilai] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMurid = async () => {
      try {
        const res = await api.get('/murid');
        setMurid(res.data || []);
      } catch (e) {
        setMessage('Gagal memuat daftar murid');
      }
    };
    fetchMurid();
  }, []);

  const submitNilai = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.post('/nilai', { muridId: selectedMurid, mapel, nilai: Number(nilai) });
      setMessage('Nilai berhasil disimpan');
      setMapel(''); setNilai('');
    } catch (e) {
      setMessage('Gagal menyimpan nilai');
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Guru</h1>

      <section className="bg-white border rounded p-4">
        <h2 className="font-medium mb-3">Daftar Murid</h2>
        <ul className="list-disc pl-6 space-y-1">
          {murid.map((m)=> (
            <li key={m.id}>{m.nama} ({m.id})</li>
          ))}
          {murid.length === 0 && <li className="list-none text-gray-500">Tidak ada data murid</li>}
        </ul>
      </section>

      <section className="bg-white border rounded p-4">
        <h2 className="font-medium mb-3">Input Nilai</h2>
        <form onSubmit={submitNilai} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-sm mb-1">Murid</label>
            <select value={selectedMurid} onChange={(e)=>setSelectedMurid(e.target.value)} className="w-full border rounded px-3 py-2" required>
              <option value="" disabled>Pilih Murid</option>
              {murid.map((m)=> <option key={m.id} value={m.id}>{m.nama}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Mapel</label>
            <input value={mapel} onChange={(e)=>setMapel(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Nilai</label>
            <input type="number" value={nilai} onChange={(e)=>setNilai(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <button className="bg-green-600 text-white rounded py-2 px-4">Simpan</button>
        </form>
        {message && <p className="text-sm mt-3">{message}</p>}
      </section>
    </div>
  );
}

