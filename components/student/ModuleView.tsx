
import React, { useState } from 'react';
import { ChevronLeft, FileText, Video, ArrowRight, Upload, CheckCircle, Image as ImageIcon, ExternalLink, Eye, MessageSquareQuote, Trash2 } from 'lucide-react';
import { Module, StudentAssignment, UserRole } from '../../types';

interface Props {
  module: Module;
  user: { name: string; nis: string; role: UserRole };
  assignments: StudentAssignment[];
  onBack: () => void;
  onNextToQuiz: () => void;
  onUploadAssignment: (assignment: StudentAssignment) => void;
  onDeleteAssignment: (id: string) => void;
}

const ModuleView: React.FC<Props> = ({ module, user, assignments, onBack, onNextToQuiz, onUploadAssignment, onDeleteAssignment }) => {
  const [uploading, setUploading] = useState(false);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0&modestbranding=1`;
    }
    return url;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const newAssignment: StudentAssignment = {
          id: Math.random().toString(36).substr(2, 9),
          studentName: user.name,
          nis: user.nis,
          moduleId: module.id,
          fileName: file.name,
          fileUrl: reader.result as string,
          timestamp: new Date().toISOString(),
          grade: null,
          feedback: ''
        };
        onUploadAssignment(newAssignment);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const viewFile = (dataUrl: string) => {
    if (!dataUrl || dataUrl === '#') return;
    try {
      const parts = dataUrl.split(',');
      const byteString = atob(parts[1]);
      const mimeString = parts[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (e) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<iframe src="${dataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
      }
    }
  };

  const videoUrl = getEmbedUrl(module.videoUrl);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="px-10 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3 text-xs font-bold text-slate-400">
          <span>Portal Belajar</span> <ChevronLeft size={14} className="rotate-180" />
          <span className="text-sky-600 uppercase tracking-widest">{module.title}</span>
        </div>

        <div className="p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">{module.title}</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Digital Competence: {module.topic}</p>
            </div>
            <button onClick={onBack} className="p-4 bg-slate-50 text-slate-400 hover:text-slate-800 rounded-2xl transition-all shadow-sm">
              <ChevronLeft size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              <div className="aspect-video bg-black rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white ring-1 ring-slate-100">
                {videoUrl ? (
                  <iframe 
                    className="w-full h-full"
                    src={videoUrl}
                    title="Materi Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-white flex-col gap-4">
                    <Video size={64} className="text-slate-700" />
                    <p className="font-black text-slate-500 uppercase tracking-widest text-xs">Video Belum Tersedia</p>
                  </div>
                )}
              </div>

              <div className="bg-white border-2 border-slate-50 p-12 rounded-[3rem] shadow-sm relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                  <FileText size={200} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-4">
                  <div className="bg-sky-500 p-2 rounded-xl text-white"><FileText size={20} /></div> Penjelasan Materi
                </h3>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                  {module.content || "Teks materi belum ditambahkan oleh guru."}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center">
                <div className="bg-sky-50 p-5 rounded-3xl text-sky-600 mb-6">
                  <FileText size={40} />
                </div>
                <h4 className="font-black text-slate-800 mb-2">Modul PDF Lengkap</h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 leading-relaxed">Pelajari detail teknis materi melalui berkas PDF resmi.</p>
                <button 
                  onClick={() => viewFile(module.pdfUrl)} 
                  className={`w-full py-5 ${module.pdfUrl === '#' ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-[#0f172a] text-white hover:bg-sky-600 shadow-xl shadow-slate-100'} font-black rounded-2xl transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3`}
                  disabled={module.pdfUrl === '#'}
                >
                  Buka Berkas PDF <Eye size={18} />
                </button>
              </div>

              <div className="bg-[#0f172a] text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Upload size={120} />
                </div>
                <h3 className="text-xl font-black mb-6 flex items-center gap-3 relative z-10">
                  <Upload size={24} className="text-orange-400" /> Kumpul Tugas
                </h3>
                
                <div className="bg-white/10 p-6 rounded-2xl mb-8 border border-white/5 relative z-10">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">INSTRUKSI GURU:</p>
                  <p className="text-sm italic leading-relaxed text-slate-300">
                    "{module.assignmentInstruction || "Gunakan instruksi yang diberikan saat tatap muka."}"
                  </p>
                </div>

                <div className="space-y-4 relative z-10">
                  <label className={`flex items-center justify-center gap-3 w-full py-4 ${uploading ? 'bg-slate-700' : 'bg-sky-500 hover:bg-sky-400 shadow-lg shadow-sky-500/20'} text-white font-black rounded-2xl transition-all cursor-pointer uppercase tracking-widest text-[11px]`}>
                    {uploading ? 'MENGUNGGAH...' : 'KIRIM PDF / GAMBAR'}
                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                  
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar mt-6">
                    {assignments.length === 0 && <p className="text-center text-slate-500 text-[10px] font-black py-4 uppercase tracking-widest">Belum ada tugas terkirim</p>}
                    {assignments.map((asg) => (
                      <div key={asg.id} className="p-5 bg-white/5 border border-white/10 rounded-[2rem] flex flex-col gap-4 group transition-all hover:bg-white/10 relative">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-sky-500/20 p-2 rounded-lg text-sky-400 shrink-0">
                              {asg.fileUrl.startsWith('data:image/') ? <ImageIcon size={14} /> : <FileText size={14} />}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-[10px] font-black truncate text-slate-300 uppercase leading-tight">{asg.fileName}</p>
                              <div className="flex gap-4 mt-1">
                                <button 
                                  onClick={() => viewFile(asg.fileUrl)}
                                  className="text-[9px] font-black text-sky-400 hover:text-sky-300 uppercase tracking-widest flex items-center gap-1"
                                >
                                  <Eye size={10} /> Lihat
                                </button>
                                {asg.grade === null && (
                                  <button 
                                    onClick={() => onDeleteAssignment(asg.id)}
                                    className="text-[9px] font-black text-rose-400 hover:text-rose-300 uppercase tracking-widest flex items-center gap-1"
                                  >
                                    <Trash2 size={10} /> Hapus
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          {asg.grade !== null && <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-black shadow-lg">NILAI: {asg.grade}</span>}
                        </div>
                        
                        {asg.feedback && (
                          <div className="bg-sky-500/10 border border-sky-500/20 p-4 rounded-2xl mt-2 relative">
                            <div className="absolute -top-3 -right-2 bg-sky-500 p-1.5 rounded-full text-white">
                              <MessageSquareQuote size={12} />
                            </div>
                            <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">Feedback Guru:</p>
                            <p className="text-xs text-slate-200 italic leading-relaxed font-medium">"{asg.feedback}"</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-sky-600 to-sky-700 p-8 rounded-[3rem] shadow-2xl text-center text-white">
                <h4 className="font-black mb-2 uppercase tracking-widest text-sm">Evaluasi Mandiri</h4>
                <p className="text-sky-100 text-xs font-bold mb-8 leading-relaxed">Siap untuk menguji pemahaman Anda? Kerjakan kuis interaktif sekarang.</p>
                <button 
                  onClick={onNextToQuiz} 
                  className="w-full py-5 bg-white text-sky-700 font-black rounded-2xl hover:bg-sky-50 transition-all shadow-xl shadow-sky-800/20 uppercase tracking-widest text-sm"
                >
                  Mulai Kuis Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ModuleView;
