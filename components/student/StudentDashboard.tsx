
import React from 'react';
import { LogOut, Home, GraduationCap, ChevronRight, BarChart3, Award, Clock } from 'lucide-react';
import { Module, UserRole, StudentQuizResult } from '../../types';
import { IconMap } from '../../constants';

interface Props {
  user: { name: string; nis: string; role: UserRole };
  modules: Module[];
  quizResults?: StudentQuizResult[];
  onSelectModule: (id: string) => void;
  onLogout: () => void;
}

const StudentDashboard: React.FC<Props> = ({ user, modules, quizResults = [], onSelectModule, onLogout }) => {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      {/* WELCOME HEADER */}
      <div className="bg-[#0f172a] rounded-[3rem] shadow-2xl p-12 mb-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none -rotate-12 translate-x-1/4 -translate-y-1/4">
          <GraduationCap size={400} />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
          <div>
            <p className="text-sky-400 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Selamat Datang Kembali</p>
            <h2 className="text-5xl font-black tracking-tighter mb-4">{user.name}</h2>
            <div className="flex items-center gap-4">
              <span className="bg-white/10 px-4 py-1 rounded-full text-[11px] font-black uppercase border border-white/5 tracking-widest">NIS: {user.nis}</span>
              <span className="bg-sky-500 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest">Siswa Aktif</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 px-8 py-4 bg-rose-500/10 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all font-black text-sm border border-rose-500/20"
            >
              <LogOut size={20} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* MODULE CATALOG */}
        <div className="col-span-12 lg:col-span-8">
          <h3 className="text-3xl font-black text-slate-800 mb-8 tracking-tighter flex items-center gap-4">
            <div className="w-2 h-8 bg-sky-500 rounded-full"></div>
            Katalog Modul Kompetensi
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {modules.map((module) => {
              const IconComponent = IconMap[module.icon] || IconMap.BookOpen;
              const result = quizResults.find(r => r.moduleId === module.id && r.nis === user.nis);
              
              return (
                <div 
                  key={module.id} 
                  className="group bg-white rounded-[3rem] p-10 border border-slate-100 hover:border-sky-200 transition-all hover:shadow-2xl flex flex-col relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="bg-slate-50 p-6 rounded-3xl group-hover:bg-sky-500 group-hover:text-white transition-all text-slate-400 shadow-sm">
                      <IconComponent size={32} />
                    </div>
                    {result && (
                      <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${result.score >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        LULUS: {Math.round(result.score)}
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-xl font-black text-slate-800 mb-2 leading-tight">
                    {module.title}
                  </h4>
                  <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-8">{module.topic}</p>
                  
                  <button 
                    onClick={() => onSelectModule(module.id)}
                    className="mt-auto w-full flex items-center justify-center gap-3 py-5 bg-[#0f172a] text-white font-black rounded-2xl hover:bg-sky-600 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-xs"
                  >
                    Buka Pembelajaran <ChevronRight size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* PROGRESS SUMMARY SIDEBAR */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
           <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <BarChart3 size={24} className="text-sky-500" /> Capaian Belajar
              </h3>
              
              <div className="space-y-6">
                {quizResults.length === 0 && (
                  <div className="text-center py-10">
                    <Clock size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-slate-300 font-bold uppercase text-[10px] tracking-widest leading-relaxed">Belum ada kuis yang diselesaikan.</p>
                  </div>
                )}
                
                {quizResults.map((res) => {
                  const mod = modules.find(m => m.id === res.moduleId);
                  return (
                    <div key={res.id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group">
                       <div className="flex justify-between items-start mb-2 relative z-10">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{mod?.title || 'Kuis'}</p>
                          {res.isManualOverride && (
                            <div className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-1 border border-amber-100">
                              <Award size={10} /> Koreksi Guru
                            </div>
                          )}
                       </div>
                       <div className="flex items-end gap-2 relative z-10">
                          <p className="text-4xl font-black text-slate-800 leading-none">{Math.round(res.score)}</p>
                          <p className="text-sm font-bold text-slate-300 mb-1">/ 100</p>
                       </div>
                       <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden relative z-10">
                          <div 
                            className={`h-full transition-all duration-1000 ${res.score >= 80 ? 'bg-emerald-500' : res.score >= 60 ? 'bg-sky-500' : 'bg-rose-500'}`} 
                            style={{ width: `${res.score}%` }}
                          ></div>
                       </div>
                       
                       <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform text-slate-900 pointer-events-none">
                          <Award size={100} />
                       </div>
                    </div>
                  );
                })}
              </div>
           </div>

           <div className="bg-sky-50 p-10 rounded-[3.5rem] border border-sky-100 text-center">
              <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-4">Butuh Bantuan?</p>
              <p className="text-sky-800 font-bold text-sm leading-relaxed mb-8">Hubungi guru pembimbing jika Anda memiliki pertanyaan mengenai materi atau nilai kuis.</p>
              <div className="w-12 h-1.5 bg-sky-300 mx-auto rounded-full"></div>
           </div>
        </div>
      </div>
      
      <div className="mt-20 pt-10 border-t border-slate-100 text-center text-slate-300 font-bold text-xs uppercase tracking-[0.3em]">
        Digital Aware &bull; Literasi Digital DigComp &bull; 2025
      </div>
    </div>
  );
};

export default StudentDashboard;
