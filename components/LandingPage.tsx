
import React from 'react';

interface Props {
  onStudentClick: () => void;
  onTeacherClick: () => void;
}

const LandingPage: React.FC<Props> = ({ onStudentClick, onTeacherClick }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-sky-50">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-sky-100">
        <div className="bg-sky-500 p-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Selamat Datang di Digital Aware</h1>
          <p className="text-sky-50 text-lg">Platform literasi digital berbasis kompetensi DigComp</p>
        </div>
        
        <div className="p-12 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
            Platform ini dirancang untuk membantu Anda memahami dan menguasai literasi digital berbasis kompetensi TIK. 
            Melalui modul-modul pembelajaran yang interaktif, Anda dapat belajar secara mandiri dan fleksibel. 
            Ayo mulai perjalanan literasi digital Anda sekarang!
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={onStudentClick}
              className="px-10 py-4 bg-sky-500 text-white font-bold rounded-full shadow-lg hover:bg-sky-600 transition-all transform hover:scale-105 text-xl"
            >
              Mulai Belajar
            </button>
            <button 
              onClick={onTeacherClick}
              className="px-10 py-4 bg-white text-sky-600 font-bold rounded-full border-2 border-sky-500 shadow-md hover:bg-sky-50 transition-all transform hover:scale-105 text-xl"
            >
              Login Sebagai Guru
            </button>
          </div>
        </div>

        <div className="bg-gray-50 py-4 text-center border-t border-gray-100">
          <p className="text-gray-400 text-sm">@ 2025 SMA Pesantren Puteri Yatama Mandiri</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
