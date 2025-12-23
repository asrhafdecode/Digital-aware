
import React, { useState, useRef } from 'react';
import { 
  LogOut, Settings, FileText, Plus, Trash2, Save, X, PlusCircle, CheckCircle, 
  LayoutDashboard, ClipboardList, MonitorPlay, Database, Users,
  Upload, FileUp, Award, Search, Image as ImageIcon, Edit3, ChevronRight, ExternalLink, Eye, ChevronLeft, Check
} from 'lucide-react';
import { Module, StudentAssignment, QuizQuestion, StudentQuizResult, QuizAnswerRecord } from '../../types';
import { IconMap } from '../../constants';

interface Props {
  modules: Module[];
  assignments: StudentAssignment[];
  quizResults: StudentQuizResult[];
  onUpdateModules: (modules: Module[]) => void;
  onLogout: () => void;
  onUpdateGrade: (id: string, grade: number, feedback: string) => void;
  onUpdateQuizGrade: (id: string, newScore: number, updatedAnswers?: QuizAnswerRecord[]) => void;
}

const TeacherDashboard: React.FC<Props> = ({ modules, assignments, quizResults = [], onUpdateModules, onLogout, onUpdateGrade, onUpdateQuizGrade }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'modules' | 'grades'>('dashboard');
  const [gradeSubTab, setGradeSubTab] = useState<'assignments' | 'quizzes'>('assignments');
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [gradingStudentId, setGradingStudentId] = useState<string | null>(null);
  
  // Quiz Manual Correction States
  const [detailedQuizCorrectionId, setDetailedQuizCorrectionId] = useState<string | null>(null);
  const [tempAnswers, setTempAnswers] = useState<QuizAnswerRecord[]>([]);

  const [gradeInput, setGradeInput] = useState<number>(0);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quizImageInputRef = useRef<HTMLInputElement>(null);
  const [activeQuizQuestionIdx, setActiveQuizQuestionIdx] = useState<number | null>(null);

  const viewFile = (dataUrl: string) => {
    if (!dataUrl || dataUrl === '#') {
      alert("Berkas tidak ditemukan.");
      return;
    }
    try {
      const parts = dataUrl.split(',');
      const byteString = atob(parts[1]);
      const mimeString = parts[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: mimeString });
      window.open(URL.createObjectURL(blob), '_blank');
    } catch (e) {
      window.open(dataUrl, '_blank');
    }
  };

  const selectedAssignment = assignments.find(a => a.id === gradingStudentId);
  const activeCorrection = quizResults.find(r => r.id === detailedQuizCorrectionId);

  const handleSaveModuleChanges = () => {
    if (editingModule) {
      onUpdateModules(modules.map(m => m.id === editingModule.id ? editingModule : m));
      setEditingModule(null);
    }
  };

  const handleSaveGrade = () => {
    if (gradingStudentId) {
      onUpdateGrade(gradingStudentId, gradeInput, feedbackInput);
      setGradingStudentId(null);
    }
  };

  // Kalkulasi total skor kuis berdasarkan bobot per soal
  const handleSaveDetailedQuiz = () => {
    if (detailedQuizCorrectionId && activeCorrection) {
      const activeModule = modules.find(m => m.id === activeCorrection.moduleId);
      if (!activeModule) return;

      const totalPossiblePoints = activeModule.questions.reduce((sum, q) => sum + q.points, 0);
      const earnedPointsTotal = tempAnswers.reduce((sum, a) => sum + a.earnedPoints, 0);
      
      // Hitung skor akhir skala 100
      const finalScore = totalPossiblePoints > 0 ? (earnedPointsTotal / totalPossiblePoints) * 100 : 0;
      
      onUpdateQuizGrade(detailedQuizCorrectionId, finalScore, tempAnswers);
      setDetailedQuizCorrectionId(null);
      alert("Detail penilaian kuis berhasil diperbarui!");
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingModule) {
      const reader = new FileReader();
      reader.onload = () => setEditingModule({ ...editingModule, pdfUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleQuizImageUpload = (e: React.ChangeEvent<HTMLInputElement>, questionIdx: number) => {
    const file = e.target.files?.[0];
    if (file && editingModule) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newQs = [...editingModule.questions];
        newQs[questionIdx].imageUrl = base64String;
        setEditingModule({ ...editingModule, questions: newQs });
      };
      reader.readAsDataURL(file);
    }
  };

  const Sidebar = () => (
    <div className="w-72 h-screen flex flex-col p-6 sticky top-0 shrink-0">
      <div className="bg-[#0f172a] h-full rounded-[2.5rem] flex flex-col text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-sky-500/20 to-transparent pointer-events-none"></div>
        <div className="p-10 relative z-10">
          <h1 className="text-xl font-black tracking-tighter italic">DIGITAL <span className="text-sky-400">AWARE</span></h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">ADMIN PANEL</p>
          <div className="w-8 h-1 bg-sky-500 mt-4 rounded-full"></div>
        </div>
        <nav className="flex-1 px-6 space-y-3 relative z-10 pt-10">
          <button onClick={() => { setEditingModule(null); setActiveTab('dashboard'); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'dashboard' ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </button>
          <button onClick={() => { setEditingModule(null); setActiveTab('modules'); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'modules' || editingModule ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Database size={18} /> <span>Kelola Modul</span>
          </button>
          <button onClick={() => { setEditingModule(null); setActiveTab('grades'); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'grades' ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Users size={18} /> <span>Rekap Nilai</span>
          </button>
        </nav>
        <div className="p-8 relative z-10">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-6 py-4 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all font-bold text-sm">
            <LogOut size={18} /> <span>Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );

  // VIEW: EDITOR MODUL
  if (editingModule) {
    return (
      <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="px-12 py-8 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
            <div>
              <h2 className="text-3xl font-black text-[#1e293b]">Editor Modul</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Tentukan Materi, Kuis, dan Bobot Nilai</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setEditingModule(null)} className="px-10 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm">Batal</button>
              <button onClick={handleSaveModuleChanges} className="flex items-center gap-3 px-10 py-3 bg-[#0ea5e9] text-white font-bold rounded-xl shadow-lg hover:bg-sky-600 transition-all text-sm">
                <Save size={18} /> Simpan
              </button>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-12">
             <div className="grid grid-cols-12 gap-10 max-w-[1600px] mx-auto">
                <div className="col-span-7 bg-white rounded-[2rem] border border-slate-200 p-12 space-y-8">
                  <h3 className="text-xl font-black text-[#1e293b]">Materi & Media</h3>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">JUDUL MODUL</label>
                    <input type="text" className="w-full p-5 bg-[#1e293b] text-white rounded-xl font-bold text-lg outline-none" value={editingModule.title} onChange={e => setEditingModule({...editingModule, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">LINK VIDEO YOUTUBE</label>
                    <input type="text" className="w-full p-5 bg-[#1e293b] text-white rounded-xl font-bold text-sm outline-none" value={editingModule.videoUrl} onChange={e => setEditingModule({...editingModule, videoUrl: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <button onClick={() => viewFile(editingModule.pdfUrl)} className="p-6 bg-[#f0fdf4] border-2 border-dashed border-[#86efac] rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-emerald-50 transition-all">
                      <div className="bg-[#4ade80] p-2 rounded-lg text-white"><FileText size={18} /></div>
                      <span className="text-[#166534] font-black text-[10px] uppercase tracking-widest">Preview PDF</span>
                    </button>
                    <div onClick={() => fileInputRef.current?.click()} className="p-6 bg-[#f0f9ff] border-2 border-dashed border-[#bae6fd] rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-sky-50 transition-all">
                      <div className="bg-[#0ea5e9] p-2 rounded-lg text-white"><Upload size={18} /></div>
                      <span className="text-[#075985] font-black text-[10px] uppercase tracking-widest">Unggah PDF Baru</span>
                      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handlePdfUpload} />
                    </div>
                  </div>
                  <textarea className="w-full p-8 bg-[#1e293b] text-white rounded-2xl h-[400px] outline-none font-medium leading-relaxed custom-scrollbar" value={editingModule.content} onChange={e => setEditingModule({...editingModule, content: e.target.value})} />
                </div>

                <div className="col-span-5 bg-white rounded-[2rem] border border-slate-200 p-10 flex flex-col max-h-[1000px]">
                   <h3 className="text-xl font-black text-[#1e293b] mb-10 flex items-center gap-3"><Award size={24} className="text-[#0ea5e9]" /> Editor Kuis</h3>
                   <div className="flex-1 overflow-y-auto pr-4 space-y-8 custom-scrollbar mb-8">
                      {editingModule.questions.map((q, idx) => (
                        <div key={q.id} className="p-8 bg-[#f8fafc] rounded-3xl border border-slate-200">
                           <div className="flex justify-between items-center mb-6">
                             <p className="text-[10px] font-black text-[#0ea5e9] uppercase tracking-widest">SOAL #{idx + 1}</p>
                             <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <label className="text-[9px] font-black text-slate-400 uppercase">BOBOT POIN:</label>
                                  <input type="number" className="w-16 p-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-center text-sky-600 focus:ring-2 focus:ring-sky-500 outline-none" value={q.points || 0} onChange={e => {
                                      const newQs = [...editingModule.questions];
                                      newQs[idx].points = parseInt(e.target.value) || 0;
                                      setEditingModule({...editingModule, questions: newQs});
                                    }} 
                                  />
                                </div>
                                <button onClick={() => setEditingModule({...editingModule, questions: editingModule.questions.filter(qu => qu.id !== q.id)})} className="text-rose-400 hover:text-rose-600 transition-colors">
                                  <Trash2 size={18} />
                                </button>
                             </div>
                           </div>
                           <div className="space-y-4">
                              <div className="flex gap-3 items-center">
                                 <input className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none" placeholder="Gambar..." value={q.imageUrl || ''} readOnly />
                                 <button onClick={() => { setActiveQuizQuestionIdx(idx); quizImageInputRef.current?.click(); }} className="px-5 py-3 bg-[#0ea5e9] text-white rounded-xl hover:bg-sky-600 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                   <ImageIcon size={16} /> Upload
                                 </button>
                              </div>
                              {q.imageUrl && (
                                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white p-4 flex justify-center">
                                  <img src={q.imageUrl} className="max-h-32 object-contain" alt="Quiz" />
                                  <button onClick={() => {
                                    const newQs = [...editingModule.questions];
                                    newQs[idx].imageUrl = '';
                                    setEditingModule({...editingModule, questions: newQs});
                                  }} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full"><X size={14} /></button>
                                </div>
                              )}
                              <textarea className="w-full p-4 bg-[#1e293b] text-white rounded-xl text-xs font-bold min-h-[80px] outline-none" value={q.text} onChange={e => {
                                  const newQs = [...editingModule.questions];
                                  newQs[idx].text = e.target.value;
                                  setEditingModule({...editingModule, questions: newQs});
                                }} 
                              />
                              <div className="space-y-2">
                                {q.options.map((opt, optIdx) => (
                                  <div key={opt.id} className="flex items-center gap-3">
                                    <button onClick={() => {
                                        const newQs = [...editingModule.questions];
                                        newQs[idx].correctOptionId = opt.id;
                                        setEditingModule({...editingModule, questions: newQs});
                                      }} 
                                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] transition-all shrink-0 ${q.correctOptionId === opt.id ? 'bg-[#0ea5e9] text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}
                                    >
                                      {opt.id.toUpperCase()}
                                    </button>
                                    <input className="flex-1 p-2 bg-[#f0f9ff] border border-[#bae6fd] rounded-lg text-[11px] font-bold outline-none" value={opt.text} onChange={e => {
                                        const newQs = [...editingModule.questions];
                                        newQs[idx].options[optIdx].text = e.target.value;
                                        setEditingModule({...editingModule, questions: newQs});
                                      }} 
                                    />
                                  </div>
                                ))}
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                   <button onClick={() => {
                      const newQ: QuizQuestion = { id: Math.random().toString(36).substr(2,9), text: '', options: [{id:'a',text:''},{id:'b',text:''},{id:'c',text:''},{id:'d',text:''}], correctOptionId:'a', points: 10 };
                      setEditingModule({...editingModule, questions: [...editingModule.questions, newQ]});
                   }} className="w-full py-4 bg-[#f0f9ff] border-2 border-dashed border-[#bae6fd] text-[#0ea5e9] font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-sky-50 transition-all uppercase tracking-widest text-[11px]">
                      <PlusCircle size={20} /> TAMBAH SOAL KUIS
                   </button>
                </div>
             </div>
          </main>
          <input type="file" ref={quizImageInputRef} className="hidden" accept="image/*" onChange={(e) => activeQuizQuestionIdx !== null && handleQuizImageUpload(e, activeQuizQuestionIdx)} />
        </div>
      </div>
    );
  }

  // VIEW: DETAIL KOREKSI KUIS PER SOAL
  if (detailedQuizCorrectionId && activeCorrection) {
    const activeModule = modules.find(m => m.id === activeCorrection.moduleId);
    
    // Inisialisasi data jawaban sementara untuk diedit
    if (tempAnswers.length === 0 && activeCorrection.studentAnswers) {
        setTempAnswers([...activeCorrection.studentAnswers]);
    }

    return (
      <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="px-12 py-8 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-6">
                <button onClick={() => {setDetailedQuizCorrectionId(null); setTempAnswers([]);}} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-800 rounded-xl transition-all shadow-sm">
                   <ChevronLeft size={24} />
                </button>
                <div>
                   <h2 className="text-3xl font-black text-[#1e293b]">Detail Jawaban Siswa</h2>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Nama: {activeCorrection.studentName} | Modul: {activeModule?.title}</p>
                </div>
             </div>
             <button onClick={handleSaveDetailedQuiz} className="flex items-center gap-3 px-10 py-4 bg-[#0ea5e9] text-white font-black rounded-2xl shadow-xl hover:bg-sky-600 transition-all text-sm uppercase tracking-widest">
                <Save size={18} /> Simpan Koreksi Akhir
             </button>
          </header>

          <main className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
             {activeModule?.questions.map((q, idx) => {
                const answer = tempAnswers.find(a => a.questionId === q.id);
                const isCorrect = answer?.selectedOptionId === q.correctOptionId;
                
                return (
                  <div key={q.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm flex flex-col md:flex-row gap-10">
                     <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">SOAL {idx + 1}</p>
                        <h4 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">{q.text}</h4>
                        {q.imageUrl && (
                          <div className="mb-6 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 p-4 inline-block">
                             <img src={q.imageUrl} className="max-h-48 object-contain" alt="Soal" />
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                           <div className={`p-6 rounded-2xl border-2 ${isCorrect ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
                              <p className="text-[10px] font-black uppercase mb-1 opacity-60">Pilihan Siswa:</p>
                              <p className="text-lg font-black">{answer?.selectedOptionId.toUpperCase()}. {q.options.find(o => o.id === answer?.selectedOptionId)?.text || 'Tidak dijawab'}</p>
                           </div>
                           <div className="p-6 rounded-2xl border-2 bg-slate-50 border-slate-200">
                              <p className="text-[10px] font-black uppercase mb-1 opacity-60">Kunci Jawaban:</p>
                              <p className="text-lg font-black">{q.correctOptionId.toUpperCase()}. {q.options.find(o => o.id === q.correctOptionId)?.text}</p>
                           </div>
                        </div>
                     </div>
                     <div className="w-full md:w-64 shrink-0 flex flex-col justify-center items-center bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Nilai Soal Ini:</label>
                        <div className="relative">
                           <input 
                             type="number" 
                             className="w-32 p-6 bg-white border-4 border-slate-200 rounded-[2rem] font-black text-4xl text-sky-600 outline-none focus:border-sky-500 text-center transition-all" 
                             value={answer?.earnedPoints || 0}
                             onChange={e => {
                                const newVal = parseInt(e.target.value) || 0;
                                setTempAnswers(prev => prev.map(a => a.questionId === q.id ? { ...a, earnedPoints: newVal } : a));
                             }}
                           />
                           <div className="absolute -top-3 -right-3 bg-sky-500 text-white p-2 rounded-full shadow-lg">
                             <Edit3 size={14} />
                           </div>
                        </div>
                        <p className="mt-4 text-[9px] font-black text-slate-400 uppercase">Maks: {q.points} Poin</p>
                     </div>
                  </div>
                );
             })}
          </main>
        </div>
      </div>
    );
  }

  // VIEW: DASHBOARD UTAMA GURU
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 p-12 pl-6">
        <header className="mb-14">
          <h2 className="text-[3.5rem] font-black text-[#1e293b] tracking-tighter leading-tight">
            {activeTab === 'dashboard' ? 'Overview Portal' : activeTab === 'modules' ? 'Katalog Modul' : 'Pusat Penilaian'}
          </h2>
          <p className="text-slate-400 font-bold text-lg">Admin Digital Aware - DigComp Education</p>
        </header>

        <div className="max-w-[1400px]">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-3 gap-10">
                <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col group hover:shadow-2xl transition-all">
                  <div className="bg-sky-50 p-6 rounded-3xl text-sky-600 mb-8 w-fit"><Database size={32} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Modul Materi</p>
                  <p className="text-6xl font-black text-[#1e293b]">{modules.length}</p>
                </div>
                <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col group hover:shadow-2xl transition-all">
                  <div className="bg-emerald-50 p-6 rounded-3xl text-emerald-600 mb-8 w-fit"><FileText size={32} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tugas Siswa</p>
                  <p className="text-6xl font-black text-[#1e293b]">{assignments.length}</p>
                </div>
                <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col group hover:shadow-2xl transition-all">
                  <div className="bg-orange-50 p-6 rounded-3xl text-orange-600 mb-8 w-fit"><Award size={32} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kuis Selesai</p>
                  <p className="text-6xl font-black text-[#1e293b]">{quizResults.length}</p>
                </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="grid grid-cols-3 gap-8">
               {modules.map((m) => {
                 const IconComponent = IconMap[m.icon] || IconMap.BookOpen;
                 return (
                   <div key={m.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-2xl hover:border-sky-100 transition-all group">
                      <div className="flex justify-between items-start mb-8">
                         <div className="bg-slate-50 p-5 rounded-[2rem] text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-all"><IconComponent size={32} /></div>
                         <div className="flex gap-2">
                            <button onClick={() => setEditingModule(m)} className="p-3 bg-slate-50 text-slate-400 hover:text-sky-600 rounded-xl transition-all"><Settings size={18} /></button>
                            <button onClick={() => onUpdateModules(modules.filter(mo => mo.id !== m.id))} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><Trash2 size={18} /></button>
                         </div>
                      </div>
                      <h4 className="text-xl font-black text-slate-800 mb-2 leading-tight">{m.title}</h4>
                      <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-6">{m.topic}</p>
                      <button onClick={() => setEditingModule(m)} className="w-full mt-auto py-4 bg-[#0f172a] text-white font-black rounded-2xl hover:bg-sky-600 transition-all text-xs uppercase tracking-widest">Atur Modul & Poin</button>
                   </div>
                 );
               })}
               <button onClick={() => {
                 const newM: Module = { id: Math.random().toString(36).substr(2,9), title: 'Modul Baru', topic: 'Topik Baru', description: '', videoUrl: '', pdfUrl: '#', content: '', assignmentInstruction: '', questions: [], icon: 'BookOpen' };
                 onUpdateModules([...modules, newM]);
                 setEditingModule(newM);
               }} className="p-10 rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:text-sky-500 transition-all">
                  <Plus size={48} className="mb-4" />
                  <p className="font-black text-sm uppercase tracking-widest">Tambah Modul</p>
               </button>
            </div>
          )}

          {activeTab === 'grades' && (
             <div className="space-y-8">
                <div className="flex p-2 bg-slate-100 rounded-2xl w-fit">
                   <button onClick={() => setGradeSubTab('assignments')} className={`px-8 py-3 rounded-xl font-black text-xs uppercase transition-all ${gradeSubTab === 'assignments' ? 'bg-white text-sky-600 shadow-md' : 'text-slate-400'}`}>Koreksi Tugas</button>
                   <button onClick={() => setGradeSubTab('quizzes')} className={`px-8 py-3 rounded-xl font-black text-xs uppercase transition-all ${gradeSubTab === 'quizzes' ? 'bg-white text-sky-600 shadow-md' : 'text-slate-400'}`}>Koreksi Kuis Per Soal</button>
                </div>

                {gradeSubTab === 'assignments' ? (
                   <div className="grid grid-cols-12 gap-8">
                      <div className="col-span-4 bg-white rounded-[3rem] border border-slate-100 p-8 h-[700px] flex flex-col shadow-sm">
                        <h3 className="font-black text-slate-800 mb-6 flex items-center justify-between"><span>Antrian Tugas</span> <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-full text-[10px]">{assignments.length}</span></h3>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                           {assignments.length === 0 && <p className="text-center text-slate-300 font-bold py-10">Kosong.</p>}
                           {assignments.map(asg => (
                             <button key={asg.id} onClick={() => { setGradingStudentId(asg.id); setGradeInput(asg.grade || 0); setFeedbackInput(asg.feedback || ''); }} className={`w-full p-6 rounded-[2rem] text-left border-2 transition-all ${gradingStudentId === asg.id ? 'bg-sky-50 border-sky-500' : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-100'}`}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-black text-slate-800 text-sm">{asg.studentName}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">NIS: {asg.nis}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); viewFile(asg.fileUrl); }} className="p-2 bg-white text-sky-500 rounded-lg shadow-sm border border-sky-50"><Eye size={14} /></button>
                                    {asg.grade !== null && <Check size={16} className="text-emerald-500" />}
                                  </div>
                                </div>
                             </button>
                           ))}
                        </div>
                      </div>
                      <div className="col-span-8">
                         {selectedAssignment ? (
                           <div className="bg-white rounded-[4rem] border border-slate-100 p-16 h-[700px] flex flex-col shadow-sm">
                              <h3 className="text-4xl font-black text-slate-800 mb-10 tracking-tighter">Beri Nilai Tugas</h3>
                              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-8">
                                 <div className="bg-slate-50 p-10 rounded-[2.5rem] border-2 border-slate-100">
                                    <div className="flex justify-between items-center mb-6">
                                       <div className="flex items-center gap-4">
                                          {selectedAssignment.fileUrl.startsWith('data:image/') ? <ImageIcon className="text-sky-500" /> : <FileText className="text-sky-500" />}
                                          <span className="font-black text-slate-800 text-sm">{selectedAssignment.fileName}</span>
                                       </div>
                                       <button onClick={() => viewFile(selectedAssignment.fileUrl)} className="bg-white px-6 py-2 rounded-xl text-sky-600 font-black text-xs flex items-center gap-2 shadow-sm border border-sky-100">Lihat Berkas <ExternalLink size={14} /></button>
                                    </div>
                                    {selectedAssignment.fileUrl.startsWith('data:image/') && (
                                       <div className="rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white flex justify-center cursor-pointer" onClick={() => viewFile(selectedAssignment.fileUrl)}>
                                          <img src={selectedAssignment.fileUrl} alt="Sub" className="max-h-[300px] object-contain" />
                                       </div>
                                    )}
                                 </div>
                                 <div className="grid grid-cols-2 gap-10">
                                    <div>
                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Nilai (0-100)</label>
                                      <input type="number" className="w-full p-8 bg-slate-50 border-4 border-slate-50 rounded-[2.5rem] font-black text-5xl text-sky-600 outline-none focus:border-sky-500" value={gradeInput} onChange={e => setGradeInput(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))} />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Feedback Guru</label>
                                      <textarea className="w-full p-8 bg-slate-50 border-4 border-slate-50 rounded-[2.5rem] h-full outline-none focus:border-sky-500 font-bold italic text-slate-600" placeholder="Pesan untuk siswa..." value={feedbackInput} onChange={e => setFeedbackInput(e.target.value)} />
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-4 mt-10">
                                <button onClick={handleSaveGrade} className="flex-1 py-5 bg-sky-600 text-white font-black rounded-[2rem] shadow-xl hover:bg-sky-700 transition-all uppercase tracking-widest text-xs">Simpan Penilaian</button>
                                <button onClick={() => setGradingStudentId(null)} className="px-10 py-5 bg-slate-100 text-slate-500 font-black rounded-[2rem] hover:bg-slate-200 transition-all text-xs">Batal</button>
                              </div>
                           </div>
                         ) : (
                           <div className="bg-white rounded-[4rem] border-4 border-dashed border-slate-50 h-full flex flex-col items-center justify-center text-center"><Users size={80} className="text-slate-100 mb-8" /><p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Pilih tugas untuk dinilai.</p></div>
                         )}
                      </div>
                   </div>
                ) : (
                   <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                               <th className="px-10 py-6">Siswa</th>
                               <th className="px-10 py-6">Modul</th>
                               <th className="px-10 py-6">Skor Akhir</th>
                               <th className="px-10 py-6">Tipe Penilaian</th>
                               <th className="px-10 py-6">Aksi</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                            {quizResults.length === 0 && (
                              <tr><td colSpan={5} className="p-10 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">Belum ada data kuis</td></tr>
                            )}
                            {quizResults.map(res => (
                               <tr key={res.id} className="hover:bg-slate-50/50 transition-all">
                                  <td className="px-10 py-8">
                                     <p className="font-black text-slate-800 text-sm">{res.studentName}</p>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NIS: {res.nis}</p>
                                  </td>
                                  <td className="px-10 py-8 font-black text-slate-600 text-xs">{modules.find(m => m.id === res.moduleId)?.title}</td>
                                  <td className="px-10 py-8">
                                     <span className="text-2xl font-black text-sky-600">{Math.round(res.score)}</span>
                                  </td>
                                  <td className="px-10 py-8">
                                     {res.isManualOverride ? (
                                       <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black rounded-full border border-amber-100 uppercase tracking-widest">Detail Koreksi Guru</span>
                                     ) : (
                                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-full border border-emerald-100 uppercase tracking-widest">Kalkulasi Sistem</span>
                                     )}
                                  </td>
                                  <td className="px-10 py-8">
                                     <button onClick={() => setDetailedQuizCorrectionId(res.id)} className="flex items-center gap-2 px-6 py-2 bg-sky-100 text-sky-600 font-black rounded-xl hover:bg-sky-200 transition-all text-[10px] uppercase tracking-widest"><Edit3 size={14} /> Lihat Detail Koreksi</button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                )}
             </div>
          )}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;
