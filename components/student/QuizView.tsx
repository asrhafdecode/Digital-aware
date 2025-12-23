
import React, { useState } from 'react';
import { ChevronLeft, BarChart2, CheckCircle, XCircle } from 'lucide-react';
import { Module, QuizAnswerRecord } from '../../types';

interface Props {
  module: Module;
  onBack: () => void;
  onFinish: (score: number, answers: QuizAnswerRecord[]) => void;
}

const QuizView: React.FC<Props> = ({ module, onBack, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswerRecord[]>([]);
  const [finished, setFinished] = useState(false);

  const questions = module.questions;

  const handleOptionClick = (id: string) => {
    if (showFeedback) return;
    setSelectedOptionId(id);
  };

  const handleSubmit = () => {
    if (!selectedOptionId) return;

    const question = questions[currentQuestionIndex];
    const isCorrect = selectedOptionId === question.correctOptionId;
    
    const newAnswer: QuizAnswerRecord = {
        questionId: question.id,
        selectedOptionId: selectedOptionId,
        isCorrect: isCorrect,
        earnedPoints: isCorrect ? (question.points || 10) : 0
    };

    setAnswers(prev => [...prev, newAnswer]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setShowFeedback(false);
    } else {
      setFinished(true);
    }
  };

  // Kalkulasi skor akhir berdasarkan poin yang didapat vs total poin yang mungkin
  const calculateFinalScore = () => {
    const totalPossiblePoints = questions.reduce((sum, q) => sum + (q.points || 10), 0);
    const earnedPointsTotal = answers.reduce((sum, a) => sum + a.earnedPoints, 0);
    return totalPossiblePoints > 0 ? (earnedPointsTotal / totalPossiblePoints) * 100 : 0;
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-10 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Belum ada kuis untuk modul ini.</h2>
          <button onClick={onBack} className="px-8 py-3 bg-sky-500 text-white rounded-xl font-bold">Kembali</button>
        </div>
      </div>
    );
  }

  if (finished) {
    const finalScore = calculateFinalScore();
    return (
      <div className="max-w-4xl mx-auto p-10 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-4 border-sky-100 w-full text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-gray-50 opacity-20"><BarChart2 size={160} /></div>
          
          <div className="relative z-10">
             <h2 className="text-4xl font-black text-gray-800 mb-10 tracking-tighter">Evaluasi Selesai</h2>
             
             <div className="bg-sky-50 rounded-[2.5rem] p-12 mb-10 inline-block min-w-[340px] border border-sky-100 shadow-sm">
                <p className="text-sm font-black text-sky-400 uppercase tracking-widest mb-3">Skor Kompetensi Anda</p>
                <div className="flex items-baseline justify-center gap-1">
                   <p className="text-[6rem] font-black text-sky-600 leading-none">{Math.round(finalScore)}</p>
                   <p className="text-2xl font-bold text-sky-300">/ 100</p>
                </div>
             </div>

             <div className="bg-gray-50 p-8 rounded-3xl mb-10 text-left border border-gray-100 max-w-lg mx-auto">
                <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-3">Catatan Sistem:</p>
                <p className="text-gray-700 italic font-medium leading-relaxed">
                  {finalScore >= 80 ? 'Luar biasa! Pemahaman Anda sangat mendalam terhadap modul ini.' : 
                   finalScore >= 60 ? 'Bagus. Anda sudah memahami dasar-dasar kompetensi ini dengan baik.' : 
                   'Pemahaman Anda masih perlu ditingkatkan. Silahkan pelajari kembali modul materi.'}
                </p>
             </div>

             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button onClick={onBack} className="px-10 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">Ulangi Materi</button>
               <button onClick={() => onFinish(finalScore, answers)} className="px-12 py-5 bg-sky-600 text-white font-black rounded-2xl shadow-xl hover:bg-sky-700 transition-all uppercase tracking-widest text-xs">Simpan & Selesai</button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-sky-100">
        <div className="px-10 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Materi</span> <ChevronLeft size={12} className="rotate-180" /> <span className="text-sky-600">Kuis Evaluasi</span>
           </div>
           <div className="bg-sky-100 text-sky-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
              Soal {currentQuestionIndex + 1} / {questions.length}
           </div>
        </div>

        <div className="p-12">
          <div className="bg-slate-50 rounded-[2.5rem] p-12 border border-slate-100">
            <h3 className="text-2xl font-black text-slate-800 mb-10 leading-relaxed">{question.text}</h3>
            
            {question.imageUrl && (
              <div className="mb-10 flex justify-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <img src={question.imageUrl} alt="Visual Soal" className="max-h-72 rounded-2xl object-contain" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {question.options.map((option) => {
                let statusClass = "bg-white border-slate-200 text-slate-700 hover:border-sky-300";
                if (showFeedback) {
                  if (option.id === question.correctOptionId) {
                    statusClass = "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20";
                  } else if (option.id === selectedOptionId) {
                    statusClass = "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20";
                  } else {
                    statusClass = "bg-white border-slate-100 text-slate-300 opacity-40";
                  }
                } else if (selectedOptionId === option.id) {
                  statusClass = "bg-sky-500 border-sky-500 text-white shadow-xl shadow-sky-500/30 ring-4 ring-sky-50";
                }

                return (
                  <button 
                    key={option.id}
                    disabled={showFeedback}
                    onClick={() => handleOptionClick(option.id)}
                    className={`p-6 rounded-2xl border-2 font-black text-lg text-left transition-all flex items-center gap-4 ${statusClass}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${selectedOptionId === option.id ? 'bg-white/20 border-white/40' : 'bg-slate-50 border-slate-100'}`}>
                       {option.id.toUpperCase()}
                    </div>
                    {option.text}
                  </button>
                );
              })}
            </div>

            <div className="mt-12">
              {showFeedback ? (
                <div className="space-y-6">
                  <div className={`flex items-center gap-4 p-6 rounded-2xl font-black text-sm uppercase tracking-widest ${selectedOptionId === question.correctOptionId ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                    {selectedOptionId === question.correctOptionId ? <CheckCircle size={24} /> : <XCircle size={24} />}
                    {selectedOptionId === question.correctOptionId ? 'Jawaban Anda Benar!' : 'Jawaban Kurang Tepat.'}
                  </div>
                  <button onClick={handleNext} className="w-full py-5 bg-sky-600 text-white font-black rounded-2xl shadow-xl hover:bg-sky-700 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                    {currentQuestionIndex === questions.length - 1 ? 'Selesaikan Evaluasi' : 'Lanjut ke Soal Berikutnya'} <BarChart2 size={18} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={!selectedOptionId}
                  className={`w-full py-5 font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs ${
                    selectedOptionId 
                      ? 'bg-[#0f172a] text-white hover:bg-sky-600' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Kirim Jawaban
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizView;
