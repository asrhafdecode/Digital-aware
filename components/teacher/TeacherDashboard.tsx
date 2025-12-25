
import React, { useState, useRef } from 'react';
import { 
  LogOut, Settings, FileText, Plus, Trash2, Save, X, PlusCircle, CheckCircle, 
  LayoutDashboard, ClipboardList, MonitorPlay, Database, Users,
  Upload, FileUp, Award, Search, Image as ImageIcon, Edit3, ChevronRight, ExternalLink, Eye, ChevronLeft, Check, Globe, Link as LinkIcon, MessageSquare, ArrowUp, ArrowDown, Type
} from 'lucide-react';
import { Module, StudentAssignment, QuizQuestion, StudentQuizResult, QuizAnswerRecord, ContentBlock } from '../../types';
import { IconMap } from '../../constants';

interface Props {
  modules: Module[];
  assignments: StudentAssignment[];
  quizResults: StudentQuizResult[];
  onUpdateModules: (modules: Module[]) => void;
  onLogout: () => void;
  onUpdateGrade: (id: string, grade: number, feedback: string) => void;
  onUpdateQuizGrade: (id: string, newScore: number, feedback?: string, updatedAnswers?: QuizAnswerRecord[]) => void;
  onDeleteAssignment: (id: string) => boolean;
}

const TeacherDashboard: React.FC<Props> = ({ modules, assignments, quizResults = [], onUpdateModules, onLogout, onUpdateGrade, onUpdateQuizGrade, onDeleteAssignment }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'modules' | 'grades'>('dashboard');
  const [gradeSubTab, setGradeSubTab] = useState<'assignments' | 'quizzes'>('assignments');
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [gradingStudentId, setGradingStudentId] = useState<string | null>(null);
  
  const [detailedQuizCorrectionId, setDetailedQuizCorrectionId] = useState<string | null>(null);
  const [tempAnswers, setTempAnswers] = useState<QuizAnswerRecord[]>([]);
  const [quizFeedbackInput, setQuizFeedbackInput] = useState<string>('');

  const [gradeInput, setGradeInput] = useState<number>(0);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);
  // Fix: Move the declaration of quizImageInputRef to the correct scope and remove the redundant assignment.
  const quizImageInputRef = useRef<HTMLInputElement>(null);
  const [activeQuizQuestionIdx, setActiveQuizQuestionIdx] = useState<number | null>(null);
  const [activeContentBlockIdx, setActiveContentBlockIdx] = useState<number | null>(null);

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

  const handleSaveDetailedQuiz = () => {
    if (detailedQuizCorrectionId && activeCorrection) {
      const activeModule = modules.find(m => m.id === activeCorrection.moduleId);
      if (!activeModule) return;

      const totalPossiblePoints = activeModule.questions.reduce((sum, q) => sum + q.points, 0);
      const earnedPointsTotal = tempAnswers.reduce((sum, a) => sum + a.earnedPoints, 0);
      
      const finalScore = totalPossiblePoints > 0 ? (earnedPointsTotal / totalPossiblePoints) * 100 : 0;
      
      onUpdateQuizGrade(detailedQuizCorrectionId, finalScore, quizFeedbackInput, tempAnswers);
      setDetailedQuizCorrectionId(null);
      setQuizFeedbackInput('');
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

  const handleRemoveModulePdf = () => {
    if (editingModule && window.confirm("Hapus file PDF materi ini?")) {
      setEditingModule({ ...editingModule, pdfUrl: '#', pdfDescription: '' });
    }
  };

  const handleContentImageUpload = (e: React.ChangeEvent<HTMLInputElement>, blockIdx: number) => {
    const file = e.target.files?.[0];
    if (file && editingModule) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newBlocks = [...(editingModule.contentBlocks || [])];
        newBlocks[blockIdx].value = base64String;
        setEditingModule({ ...editingModule, contentBlocks: newBlocks });
      };
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

  const handleDeleteAssignmentByTeacher = (id: string) => {
    if (onDeleteAssignment(id)) {
      if (gradingStudentId === id) {
        setGradingStudentId(null);
      }
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

  if (editingModule) {
    const blocks = editingModule.contentBlocks || [];

    const addBlock = (type: 'text' | 'image') => {
      const newBlock: ContentBlock = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        value: ''
      };
      setEditingModule({ ...editingModule, contentBlocks: [...blocks, newBlock] });
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
      const newBlocks = [...blocks];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < newBlocks.length) {
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        setEditingModule({ ...editingModule, contentBlocks: newBlocks });
      }
    };

    const deleteBlock = (index: number) => {
      const newBlocks = blocks.filter((_, i) => i !== index);
      setEditingModule({ ...editingModule, contentBlocks: newBlocks });
    };

    const updateBlockValue = (index: number, value: string) => {
      const newBlocks = [...blocks];
      newBlocks[index].value = value;
      setEditingModule({ ...editingModule, contentBlocks: newBlocks });
    };

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
                <Save size={18} /> Simpan Perubahan
              </button>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-12">
             <div className="grid grid-cols-12 gap-10 max-w-[1600px] mx-auto">
                <div className="col-span-7 space-y-8">
                  <div className="bg-white rounded-[2rem] border border-slate-200 p-12 space-y-8">
                    <h3 className="text-xl font-black text-[#1e293b]">Info Utama & Media</h3>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">JUDUL MODUL</label>
                      <input type="text" className="w-full p-5 bg-[#1e293b] text-white rounded-xl font-bold text-lg outline-none" value={editingModule.title} onChange={e => setEditingModule({...editingModule, title: e.target.value})} />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">LINK VIDEO YOUTUBE</label>
                        <input type="text" className="w-full p-5 bg-[#1e293b] text-white rounded-xl font-bold text-sm outline-none" value={editingModule.videoUrl} onChange={e => setEditingModule({...editingModule, videoUrl: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">DESKRIPSI VIDEO (Dilihat Siswa)</label>
                        <textarea 
                          className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-sky-500 h-24" 
                          placeholder="Berikan rangkuman atau poin penting dari video ini..."
                          value={editingModule.videoDescription || ''} 
                          onChange={e => setEditingModule({...editingModule, videoDescription: e.target.value})} 
                        />
                      </div>
                    </div>

                    <div className="p-8 bg-sky-50 rounded-[2.5rem] border border-sky-100">
                      <h4 className="text-sm font-black text-sky-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
                        <FileText size={18} /> Berkas Materi PDF
                      </h4>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        {editingModule.pdfUrl !== '#' ? (
                          <div className="relative group">
                            <button onClick={() => viewFile(editingModule.pdfUrl)} className="w-full p-6 bg-white border-2 border-dashed border-emerald-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-emerald-50 transition-all">
                              <div className="bg-emerald-500 p-2 rounded-lg text-white"><FileText size={18} /></div>
                              <span className="text-emerald-700 font-black text-[10px] uppercase tracking-widest">Preview PDF</span>
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleRemoveModulePdf(); }} 
                              className="absolute -top-3 -right-3 p-2 bg-rose-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                              title="Hapus PDF Materi"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="p-6 bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 opacity-50">
                            <div className="bg-slate-300 p-2 rounded-lg text-white"><FileText size={18} /></div>
                            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Belum Ada PDF</span>
                          </div>
                        )}
                        
                        <div onClick={() => fileInputRef.current?.click()} className="p-6 bg-white border-2 border-dashed border-sky-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-sky-50 transition-all shadow-sm">
                          <div className="bg-sky-500 p-2 rounded-lg text-white"><Upload size={18} /></div>
                          <span className="text-sky-700 font-black text-[10px] uppercase tracking-widest">Ganti PDF</span>
                          <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handlePdfUpload} />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">DESKRIPSI / PENJELASAN BERKAS PDF</label>
                        <textarea 
                          className="w-full p-5 bg-white border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-sky-500 h-24" 
                          placeholder="Jelaskan isi PDF ini kepada siswa agar mereka paham apa yang harus dipelajari..."
                          value={editingModule.pdfDescription || ''} 
                          onChange={e => setEditingModule({...editingModule, pdfDescription: e.target.value})} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* EDITOR BLOK MATERI */}
                  <div className="bg-white rounded-[2rem] border border-slate-200 p-12">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-xl font-black text-[#1e293b]">Penjelasan Materi (Blok Editor)</h3>
                      <div className="flex gap-4">
                        <button onClick={() => addBlock('text')} className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20">
                          <Type size={16} /> Tambah Teks
                        </button>
                        <button onClick={() => addBlock('image')} className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                          <ImageIcon size={16} /> Tambah Gambar
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {blocks.length === 0 && (
                        <div className="py-20 text-center border-4 border-dashed border-slate-50 rounded-[3rem]">
                           <FileText size={48} className="mx-auto text-slate-100 mb-4" />
                           <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Mulai susun materi Anda dengan menambahkan blok teks atau gambar.</p>
                        </div>
                      )}
                      {blocks.map((block, index) => (
                        <div key={block.id} className="group bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 relative">
                          <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => moveBlock(index, 'up')} className="p-2 bg-white text-slate-400 hover:text-sky-600 rounded-lg shadow-sm border border-slate-100"><ArrowUp size={14} /></button>
                             <button onClick={() => moveBlock(index, 'down')} className="p-2 bg-white text-slate-400 hover:text-sky-600 rounded-lg shadow-sm border border-slate-100"><ArrowDown size={14} /></button>
                          </div>
                          <div className="flex justify-between items-center mb-6">
                             <div className="flex items-center gap-3">
                               <div className={`p-2 rounded-lg text-white ${block.type === 'text' ? 'bg-sky-500' : 'bg-emerald-500'}`}>
                                 {block.type === 'text' ? <Type size={16} /> : <ImageIcon size={16} />}
                               </div>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BLOK {index + 1}: {block.type === 'text' ? 'TEKS' : 'GAMBAR'}</span>
                             </div>
                             <button onClick={() => deleteBlock(index)} className="p-2 text-rose-400 hover:text-rose-600 transition-all"><Trash2 size={18} /></button>
                          </div>

                          {block.type === 'text' ? (
                            <textarea 
                              className="w-full p-6 bg-white border border-slate-200 rounded-2xl font-medium leading-relaxed outline-none focus:ring-2 focus:ring-sky-500 h-40 custom-scrollbar"
                              placeholder="Ketik penjelasan materi di sini..."
                              value={block.value}
                              onChange={e => updateBlockValue(index, e.target.value)}
                            />
                          ) : (
                            <div className="space-y-4">
                               <div className="flex gap-4">
                                  <div className="relative flex-1">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Globe size={14} /></div>
                                    <input 
                                      className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500" 
                                      placeholder="Masukkan link gambar eksternal (https://...)" 
                                      value={block.value}
                                      onChange={e => updateBlockValue(index, e.target.value)}
                                    />
                                  </div>
                                  <button onClick={() => { setActiveContentBlockIdx(index); contentImageInputRef.current?.click(); }} className="px-6 py-4 bg-emerald-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                                    <Upload size={16} /> Upload Gambar
                                  </button>
                               </div>
                               {block.value && (
                                 <div className="relative group/img rounded-2xl overflow-hidden border border-slate-200 bg-white p-2 max-h-60 flex justify-center">
                                    <img 
                                      src={block.value} 
                                      className="max-h-56 object-contain rounded-xl" 
                                      alt="Preview" 
                                      onError={(e) => {(e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x300?text=Gambar+Tidak+Ditemukan';}}
                                    />
                                    <button onClick={() => updateBlockValue(index, '')} className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-full shadow-lg opacity-0 group-hover/img:opacity-100 transition-opacity"><X size={14} /></button>
                                 </div>
                               )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-5 flex flex-col gap-10">
                   {/* KUIS INTERNAL EDITOR */}
                   <div className="bg-white rounded-[2rem] border border-slate-200 p-10 flex flex-col max-h-[800px]">
                      <h3 className="text-xl font-black text-[#1e293b] mb-10 flex items-center gap-3"><Award size={24} className="text-[#0ea5e9]" /> Editor Kuis Internal</h3>
                      <div className="flex-1 overflow-y-auto pr-4 space-y-8 custom-scrollbar mb-8">
                          {editingModule.questions.map((q, idx) => (
                            <div key={q.id} className="p-8 bg-[#f8fafc] rounded-3xl border border-slate-200">
                               <div className="flex justify-between items-center mb-6">
                                 <p className="text-[10px] font-black text-[#0ea5e9] uppercase tracking-widest">SOAL #{idx + 1}</p>
                                 <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <label className="text-[9px] font-black text-slate-400 uppercase">BOBOT:</label>
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
                                     <div className="relative flex-1">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Globe size={14} /></div>
                                        <input className="w-full pl-9 pr-3 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none" placeholder="Link Gambar..." value={q.imageUrl || ''} onChange={(e) => {
                                            const newQs = [...editingModule.questions];
                                            newQs[idx].imageUrl = e.target.value;
                                            setEditingModule({...editingModule, questions: newQs});
                                          }}
                                        />
                                     </div>
                                     <button onClick={() => { setActiveQuizQuestionIdx(idx); quizImageInputRef.current?.click(); }} className="px-5 py-3 bg-[#0ea5e9] text-white rounded-xl hover:bg-sky-600 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ImageIcon size={16} /></button>
                                  </div>

                                  {q.imageUrl && (
                                    <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-white p-2">
                                      <img 
                                        src={q.imageUrl} 
                                        className="max-h-40 w-full object-contain bg-slate-50" 
                                        alt="Preview" 
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Gambar+Tidak+Valid'; }}
                                      />
                                      <button 
                                        onClick={() => {
                                          const newQs = [...editingModule.questions];
                                          newQs[idx].imageUrl = '';
                                          setEditingModule({...editingModule, questions: newQs});
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X size={14} />
                                      </button>
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
                          <PlusCircle size={20} /> TAMBAH SOAL
                      </button>
                   </div>

                   {/* KUIS EKSTERNAL EDITOR */}
                   <div className="bg-[#0f172a] rounded-[2rem] p-10 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><LinkIcon size={120} /></div>
                      <h3 className="text-xl font-black mb-8 flex items-center gap-3 relative z-10"><LinkIcon size={24} className="text-sky-400" /> Kuis Eksternal</h3>
                      <div className="space-y-6 relative z-10">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">TIPE PLATFORM</label>
                          <select 
                            className="w-full p-4 bg-white/10 border border-white/10 rounded-xl font-bold text-sm outline-none text-white appearance-none cursor-pointer"
                            value={editingModule.externalQuizType || ''}
                            onChange={(e) => setEditingModule({...editingModule, externalQuizType: e.target.value})}
                          >
                            <option value="" className="text-slate-800">-- Pilih Platform --</option>
                            <option value="Quizizz" className="text-slate-800">Quizizz</option>
                            <option value="Kahoot" className="text-slate-800">Kahoot</option>
                            <option value="Google Forms" className="text-slate-800">Google Forms</option>
                            <option value="Lainnya" className="text-slate-800">Lainnya</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">URL KUIS LUAR</label>
                          <input 
                            type="text" 
                            className="w-full p-4 bg-white/10 border border-white/10 rounded-xl font-bold text-sm outline-none placeholder:text-slate-500" 
                            placeholder="https://quizizz.com/join?..." 
                            value={editingModule.externalQuizUrl || ''} 
                            onChange={(e) => setEditingModule({...editingModule, externalQuizUrl: e.target.value})}
                          />
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </main>
          <input type="file" ref={contentImageInputRef} className="hidden" accept="image/*" onChange={(e) => activeContentBlockIdx !== null && handleContentImageUpload(e, activeContentBlockIdx)} />
          <input type="file" ref={quizImageInputRef} className="hidden" accept="image/*" onChange={(e) => activeQuizQuestionIdx !== null && handleQuizImageUpload(e, activeQuizQuestionIdx)} />
        </div>
      </div>
    );
  }

  if (detailedQuizCorrectionId && activeCorrection) {
    const activeModule = modules.find(m => m.id === activeCorrection.moduleId);
    if (tempAnswers.length === 0 && activeCorrection.studentAnswers) {
        setTempAnswers([...activeCorrection.studentAnswers]);
    }

    return (
      <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="px-12 py-8 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-6">
                <button onClick={() => {setDetailedQuizCorrectionId(null); setTempAnswers([]); setQuizFeedbackInput('');}} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-800 rounded-xl transition-all shadow-sm">
                   <ChevronLeft size={24} />
                </button>
                <div>
                   <h2 className="text-3xl font-black text-[#1e293b]">Detail Jawaban</h2>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{activeCorrection.studentName} | {activeModule?.title}</p>
                </div>
             </div>
             <button onClick={handleSaveDetailedQuiz} className="flex items-center gap-3 px-10 py-4 bg-[#0ea5e9] text-white font-black rounded-2xl shadow-xl hover:bg-sky-600 transition-all text-sm uppercase tracking-widest">
                <Save size={18} /> Simpan Koreksi
             </button>
          </header>

          <main className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
             <div className="bg-[#0f172a] p-10 rounded-[3rem] text-white border-4 border-sky-500/20 shadow-xl mb-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-sky-500 p-3 rounded-2xl text-white"><MessageSquare size={24} /></div>
                  <h3 className="text-2xl font-black tracking-tight">Feedback Evaluasi Siswa</h3>
                </div>
                <textarea 
                  className="w-full p-6 bg-white/10 border border-white/10 rounded-2xl text-white font-bold italic h-32 outline-none focus:ring-2 focus:ring-sky-500" 
                  placeholder="Berikan saran atau pujian untuk upaya siswa ini..."
                  value={quizFeedbackInput}
                  onChange={(e) => setQuizFeedbackInput(e.target.value)}
                />
             </div>

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
                              <p className="text-[10px] font-black uppercase mb-1 opacity-60">Kunci:</p>
                              <p className="text-lg font-black">{q.correctOptionId.toUpperCase()}. {q.options.find(o => o.id === q.correctOptionId)?.text}</p>
                           </div>
                        </div>
                     </div>
                     <div className="w-full md:w-64 shrink-0 flex flex-col justify-center items-center bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Poin:</label>
                        <input type="number" className="w-32 p-6 bg-white border-4 border-slate-200 rounded-[2rem] font-black text-4xl text-sky-600 text-center outline-none" value={answer?.earnedPoints || 0} onChange={e => {
                            const newVal = parseInt(e.target.value) || 0;
                            setTempAnswers(prev => prev.map(a => a.questionId === q.id ? { ...a, earnedPoints: newVal } : a));
                        }} />
                        <p className="mt-4 text-[9px] font-black text-slate-400 uppercase">Maks: {q.points}</p>
                     </div>
                  </div>
                );
             })}
          </main>
        </div>
      </div>
    );
  }

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
                <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-2xl transition-all">
                  <div className="bg-sky-50 p-6 rounded-3xl text-sky-600 mb-8 w-fit"><Database size={32} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Modul Materi</p>
                  <p className="text-6xl font-black text-[#1e293b]">{modules.length}</p>
                </div>
                <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-2xl transition-all">
                  <div className="bg-emerald-50 p-6 rounded-3xl text-emerald-600 mb-8 w-fit"><FileText size={32} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tugas Siswa</p>
                  <p className="text-6xl font-black text-[#1e293b]">{assignments.length}</p>
                </div>
                <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-2xl transition-all">
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
                      <button onClick={() => setEditingModule(m)} className="w-full mt-auto py-4 bg-[#0f172a] text-white font-black rounded-2xl hover:bg-sky-600 transition-all text-xs uppercase tracking-widest">Atur Konten & Kuis</button>
                   </div>
                 );
               })}
               <button onClick={() => {
                 const newM: Module = { id: Math.random().toString(36).substr(2,9), title: 'Modul Baru', topic: 'Topik Baru', description: '', videoUrl: '', videoDescription: '', pdfUrl: '#', content: '', assignmentInstruction: '', questions: [], icon: 'BookOpen', contentBlocks: [] };
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
                   <button onClick={() => setGradeSubTab('quizzes')} className={`px-8 py-3 rounded-xl font-black text-xs uppercase transition-all ${gradeSubTab === 'quizzes' ? 'bg-white text-sky-600 shadow-md' : 'text-slate-400'}`}>Koreksi Kuis</button>
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
                                  <div className="overflow-hidden">
                                    <p className="font-black text-slate-800 text-sm truncate">{asg.studentName}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">NIS: {asg.nis}</p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={(e) => { e.stopPropagation(); viewFile(asg.fileUrl); }} className="p-2 bg-white text-sky-500 rounded-lg shadow-sm border border-sky-50 hover:bg-sky-50 transition-colors"><Eye size={14} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteAssignmentByTeacher(asg.id); }} className="p-2 bg-white text-rose-400 rounded-lg shadow-sm border border-rose-50 hover:bg-rose-50 transition-colors"><Trash2 size={14} /></button>
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
                              <div className="flex justify-between items-start mb-10">
                                 <div>
                                    <h3 className="text-4xl font-black text-slate-800 tracking-tighter">Beri Nilai Tugas</h3>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Siswa: {selectedAssignment.studentName}</p>
                                 </div>
                                 <button onClick={() => handleDeleteAssignmentByTeacher(selectedAssignment.id)} className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-500 font-black rounded-xl hover:bg-rose-500 hover:text-white transition-all text-[10px] uppercase tracking-widest border border-rose-100 shadow-sm">
                                    <Trash2 size={16} /> Hapus Berkas Salah
                                 </button>
                              </div>
                              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-8">
                                 <div className="bg-slate-50 p-10 rounded-[2.5rem] border-2 border-slate-100">
                                    <div className="flex justify-between items-center mb-6">
                                       <div className="flex items-center gap-4">
                                          {selectedAssignment.fileUrl.startsWith('data:image/') ? <ImageIcon className="text-sky-500" /> : <FileText className="text-sky-500" />}
                                          <span className="font-black text-slate-800 text-sm truncate max-w-[300px]">{selectedAssignment.fileName}</span>
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
                               <th className="px-10 py-6">Skor</th>
                               <th className="px-10 py-6">Status</th>
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
                                  <td className="px-10 py-8"><span className="text-2xl font-black text-sky-600">{Math.round(res.score)}</span></td>
                                  <td className="px-10 py-8">
                                     {res.isManualOverride ? (
                                       <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black rounded-full border border-amber-100 uppercase tracking-widest">Diedit Guru</span>
                                     ) : (
                                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-full border border-emerald-100 uppercase tracking-widest">Otomatis</span>
                                     )}
                                  </td>
                                  <td className="px-10 py-8">
                                     <button onClick={() => setDetailedQuizCorrectionId(res.id)} className="flex items-center gap-2 px-6 py-2 bg-sky-100 text-sky-600 font-black rounded-xl hover:bg-sky-200 transition-all text-[10px] uppercase tracking-widest"><Edit3 size={14} /> Koreksi Detail</button>
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
