
import React, { useState, useEffect } from 'react';
import { getInitialState, saveState } from './services/stateService';
import { AppState, UserRole, Module, StudentAssignment, StudentQuizResult, QuizAnswerRecord } from './types';
import LandingPage from './components/LandingPage';
import StudentLogin from './components/student/StudentLogin';
import TeacherLogin from './components/teacher/TeacherLogin';
import StudentDashboard from './components/student/StudentDashboard';
import ModuleView from './components/student/ModuleView';
import QuizView from './components/student/QuizView';
import TeacherDashboard from './components/teacher/TeacherDashboard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(getInitialState());
  const [view, setView] = useState<'landing' | 'student-login' | 'teacher-login' | 'student-dashboard' | 'teacher-dashboard' | 'module-detail' | 'quiz-view'>('landing');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    setView('landing');
    setActiveModuleId(null);
  };

  const handleStudentLogin = (name: string, nis: string) => {
    setState(prev => ({
      ...prev,
      currentUser: { name, nis, role: UserRole.STUDENT }
    }));
    setView('student-dashboard');
  };

  const handleTeacherLogin = () => {
    setState(prev => ({
      ...prev,
      currentUser: { name: 'Admin Guru', nis: 'ADMIN', role: UserRole.TEACHER }
    }));
    setView('teacher-dashboard');
  };

  const updateModules = (newModules: Module[]) => {
    setState(prev => ({ ...prev, modules: newModules }));
  };

  const handleAssignmentUpload = (assignment: StudentAssignment) => {
    setState(prev => ({
      ...prev,
      assignments: [...prev.assignments, assignment]
    }));
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      setState(prev => ({
        ...prev,
        assignments: prev.assignments.filter(a => a.id !== assignmentId)
      }));
    }
  };

  const handleGradeUpdate = (assignmentId: string, grade: number, feedback: string) => {
    setState(prev => ({
      ...prev,
      assignments: prev.assignments.map(a => a.id === assignmentId ? { ...a, grade, feedback } : a)
    }));
  };

  const handleQuizGradeUpdate = (resultId: string, newScore: number, updatedAnswers?: QuizAnswerRecord[]) => {
    setState(prev => ({
      ...prev,
      quizResults: prev.quizResults.map(r => 
        r.id === resultId 
          ? { 
              ...r, 
              score: newScore, 
              isManualOverride: true, 
              studentAnswers: updatedAnswers || r.studentAnswers 
            } 
          : r
      )
    }));
  };

  const activeModule = state.modules.find(m => m.id === activeModuleId);

  return (
    <div className="min-h-screen">
      {view === 'landing' && (
        <LandingPage 
          onStudentClick={() => setView('student-login')} 
          onTeacherClick={() => setView('teacher-login')} 
        />
      )}

      {view === 'student-login' && (
        <StudentLogin 
          onBack={() => setView('landing')} 
          onLogin={handleStudentLogin} 
        />
      )}

      {view === 'teacher-login' && (
        <TeacherLogin 
          onBack={() => setView('landing')} 
          onLogin={handleTeacherLogin} 
        />
      )}

      {view === 'student-dashboard' && state.currentUser && (
        <StudentDashboard 
          user={state.currentUser} 
          modules={state.modules} 
          quizResults={state.quizResults.filter(r => r.nis === state.currentUser?.nis)}
          onSelectModule={(id) => { setActiveModuleId(id); setView('module-detail'); }}
          onLogout={handleLogout}
        />
      )}

      {view === 'module-detail' && activeModule && state.currentUser && (
        <ModuleView 
          module={activeModule} 
          user={state.currentUser}
          assignments={state.assignments.filter(a => a.moduleId === activeModule.id && a.nis === state.currentUser?.nis)}
          onBack={() => setView('student-dashboard')}
          onNextToQuiz={() => setView('quiz-view')}
          onUploadAssignment={handleAssignmentUpload}
          onDeleteAssignment={handleDeleteAssignment}
        />
      )}

      {view === 'quiz-view' && activeModule && state.currentUser && (
        <QuizView 
          module={activeModule} 
          onBack={() => setView('module-detail')}
          onFinish={(score, answers) => {
            setState(prev => ({
              ...prev,
              quizResults: [...prev.quizResults, {
                id: Math.random().toString(36).substr(2, 9),
                studentName: state.currentUser!.name,
                nis: state.currentUser!.nis,
                moduleId: activeModule.id,
                score,
                timestamp: new Date().toISOString(),
                studentAnswers: answers
              }]
            }));
            setView('student-dashboard');
          }}
        />
      )}

      {view === 'teacher-dashboard' && state.currentUser && (
        <TeacherDashboard 
          modules={state.modules}
          assignments={state.assignments}
          quizResults={state.quizResults}
          onUpdateModules={updateModules}
          onLogout={handleLogout}
          onUpdateGrade={handleGradeUpdate}
          onUpdateQuizGrade={handleQuizGradeUpdate}
        />
      )}
    </div>
  );
};

export default App;
