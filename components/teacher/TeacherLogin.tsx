
import React, { useState } from 'react';
import { ShieldAlert, ChevronLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
  onLogin: () => void;
}

const TeacherLogin: React.FC<Props> = ({ onBack, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-sky-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-sky-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-sky-100 p-4 rounded-full mb-4">
            <ShieldAlert size={64} className="text-sky-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Login Guru</h2>
          <p className="text-gray-500">Akses Panel Pengelolaan Modul</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password Admin</label>
            <input 
              type="password" 
              required
              placeholder="Masukkan Password"
              className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-sky-500 outline-none transition-all`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs mt-2 font-bold">Password yang anda masukkan salah!</p>}
          </div>

          <div className="flex gap-4">
            <button 
              type="submit"
              className="flex-1 py-4 bg-sky-500 text-white font-bold rounded-xl shadow-lg hover:bg-sky-600 transition-all transform hover:scale-105"
            >
              Login
            </button>
            <button 
              type="button"
              onClick={onBack}
              className="px-8 py-4 bg-white text-gray-500 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;
