
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  NONE = 'NONE'
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  imageUrl?: string;
  options: QuizOption[];
  correctOptionId: string;
  points: number; // Menentukan bobot nilai tiap soal
}

export interface Module {
  id: string;
  title: string;
  topic: string;
  description: string;
  videoUrl: string;
  pdfUrl: string;
  content: string;
  assignmentInstruction: string;
  questions: QuizQuestion[];
  icon: string;
}

export interface StudentAssignment {
  id: string;
  studentName: string;
  nis: string;
  moduleId: string;
  fileName: string;
  fileUrl: string;
  timestamp: string;
  grade: number | null;
  feedback: string;
}

export interface QuizAnswerRecord {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  earnedPoints: number;
}

export interface StudentQuizResult {
  id: string;
  studentName: string;
  nis: string;
  moduleId: string;
  score: number;
  timestamp: string;
  isManualOverride?: boolean;
  studentAnswers?: QuizAnswerRecord[]; // Detail jawaban untuk koreksi per soal
}

export interface AppState {
  modules: Module[];
  assignments: StudentAssignment[];
  quizResults: StudentQuizResult[];
  currentUser: {
    name: string;
    nis: string;
    role: UserRole;
  } | null;
}
