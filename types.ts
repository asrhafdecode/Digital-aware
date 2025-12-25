
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
  points: number;
}

export type ContentBlockType = 'text' | 'image';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  value: string;
}

export interface Module {
  id: string;
  title: string;
  topic: string;
  description: string;
  videoUrl: string;
  videoDescription: string;
  pdfUrl: string;
  pdfDescription?: string; // Deskripsi penjelasan materi PDF
  content: string; // Legacy content (string)
  contentBlocks?: ContentBlock[]; // Materi berbasis blok (teks & gambar)
  assignmentInstruction: string;
  questions: QuizQuestion[];
  icon: string;
  externalQuizUrl?: string;
  externalQuizType?: string;
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
  feedback?: string;
  isManualOverride?: boolean;
  studentAnswers?: QuizAnswerRecord[];
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
