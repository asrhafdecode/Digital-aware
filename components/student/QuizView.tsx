
import React, { useState } from 'react';
import { ChevronLeft, BarChart2, CheckCircle, XCircle } from 'lucide-react';
import { Module } from '../../types';

interface Props {
  module: Module;
  onBack: () => void;
  onFinish: (score: number) => void;
}

const QuizView: React.FC<Props> = ({ module, onBack, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = module.questions;

  const handleOptionClick = (id: string) => {
    if (showFeedback) return;
    setSelectedOptionId(id);
  };

  const handleSubmit = () => {
    if (!selectedOptionId) return;

    const isCorrect = selectedOptionId === questions[currentQuestionIndex].correctOptionId;
    if (isCorrect) setScore(prev => prev + (100 / questions.length));
    
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
    return (
      <div className="max-w-4xl mx-auto p-10 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-12 rounded-3xl shadow-2xl border-4 border-sky-100 w-full text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-gray-100"><BarChart2 size={120} /></div>
          
          <div className="relative z-10">
             <div className="flex justify-center mb-6 text-gray-400 text-sm gap-2">
                <span>Home</span> &gt; <span>Modul</span> &gt; <span>Materi</span> &gt; <span>Kuis</span> &gt; <span className="text-sky-600">Hasil</span>
             </div>
             
             <h2 className="text-4xl font-black text-gray-800 mb-10">Hasil Kuis</h2>
             
             <div className="bg-sky-50 rounded-2xl p-8 mb-8 inline-block min-w-[300px]">
                <p className="text-2xl text-gray-600 mb-2">Skor Anda :</p>
                <p className="text-6xl font-black text-sky-600">{Math.round(score)}/100</p>
             </div>

             <div className="bg-gray-50 p-6 rounded-2xl mb-10 text-left border border-gray-100">
                <p className="text-gray-500 font-bold mb-2">Saran :</p>
                <p className="text-gray-700 italic">
                  {score >= 80 ? 'Bagus sekali! Anda telah menguasai materi ini dengan sangat baik.' : 
                   score >= 50 ? 'Cukup baik. Cobalah mengulang beberapa bagian materi untuk hasil yang lebih maksimal.' : 
                   'Anda perlu belajar lebih giat lagi. Silahkan pelajari kembali modul materi ini.'}
                </p>
             </div>

             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button 
                  onClick={onBack}
                  className="px-8 py-4 bg-sky-100 text-sky-600 font-bold rounded-xl hover:bg-sky-200 transition-all"
               >
                 Kembali Ke Modul
               </button>
               <button 
                  onClick={() => onFinish(score)}
                  className="px-8 py-4 bg-sky-500 text-white font-bold rounded-xl shadow-lg hover:bg-sky-600 transition-all"
               >
                 Selesai
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-sky-100">
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span> <ChevronLeft size={14} className="rotate-180" />
          <span>Modul</span> <ChevronLeft size={14} className="rotate-180" />
          <span>Materi</span> <ChevronLeft size={14} className="rotate-180" />
          <span className="text-sky-600 font-medium">Kuis</span>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Kuis {module.title}</h2>
            <div className="bg-sky-100 text-sky-600 px-4 py-1 rounded-full text-sm font-bold">
              Soal {currentQuestionIndex + 1} / {questions.length}
            </div>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-8">Pertanyaan {currentQuestionIndex + 1} : {question.text}</h3>
            
            {question.imageUrl && (
              <div className="mb-8 flex justify-center">
                <img src={question.imageUrl} alt="Question Graphic" className="max-h-64 rounded-xl shadow-md border-4 border-white" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {question.options.map((option) => {
                let statusClass = "bg-white border-gray-200 text-gray-700 hover:border-sky-300";
                if (showFeedback) {
                  if (option.id === question.correctOptionId) {
                    statusClass = "bg-green-500 border-green-500 text-white";
                  } else if (option.id === selectedOptionId) {
                    statusClass = "bg-red-500 border-red-500 text-white";
                  } else {
                    statusClass = "bg-white border-gray-200 text-gray-300 opacity-50";
                  }
                } else if (selectedOptionId === option.id) {
                  statusClass = "bg-sky-500 border-sky-500 text-white ring-4 ring-sky-100";
                }

                return (
                  <button 
                    key={option.id}
                    disabled={showFeedback}
                    onClick={() => handleOptionClick(option.id)}
                    className={`p-6 rounded-2xl border-2 font-bold text-lg text-left transition-all ${statusClass}`}
                  >
                    <span className="mr-4">{option.id.toUpperCase()}.</span>
                    {option.text}
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col items-center">
              {showFeedback ? (
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-white border border-gray-200">
                    <span className="font-bold">Feedback :</span>
                    {selectedOptionId === question.correctOptionId ? (
                      <span className="text-green-600 font-bold flex items-center gap-2"><CheckCircle /> Jawaban Anda Benar!</span>
                    ) : (
                      <span className="text-red-600 font-bold flex items-center gap-2"><XCircle /> Jawaban Anda Salah.</span>
                    )}
                  </div>
                  <button 
                    onClick={handleNext}
                    className="w-full py-4 bg-sky-500 text-white font-bold rounded-xl shadow-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'Lihat Hasil Akhir' : 'Lanjut Ke Soal Berikutnya'}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={!selectedOptionId}
                  className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all ${
                    selectedOptionId 
                      ? 'bg-sky-500 text-white hover:bg-sky-600' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Submit
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
