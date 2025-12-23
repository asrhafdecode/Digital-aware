
import React, { useState } from 'react';
import { User, ChevronLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
  onLogin: (name: string, nis: string) => void;
}

const StudentLogin: React.FC<Props> = ({ onBack, onLogin }) => {
  const [name, setName] = useState('');
  const [nis, setNis] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && nis) {
      onLogin(name, nis);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-sky-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-sky-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-sky-100 p-4 rounded-full mb-4">
            <User size={64} className="text-sky-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Login Siswa</h2>
          <p className="text-gray-500">Masukkan Identitas Anda Untuk Mulai Belajar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
            <input 
              type="text" 
              required
              placeholder="Contoh: Siti Aminah"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">NIS (Nomor Induk Siswa)</label>
            <input 
              type="text" 
              required
              placeholder="Contoh: 12345"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
              value={nis}
              onChange={(e) => setNis(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-sky-500 text-white font-bold rounded-xl shadow-lg hover:bg-sky-600 transition-all transform hover:scale-105"
          >
            Masuk Kelas
          </button>

          <button 
            type="button"
            onClick={onBack}
            className="w-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors mt-4"
          >
            <ChevronLeft size={20} />
            <span>Kembali Ke Home</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
