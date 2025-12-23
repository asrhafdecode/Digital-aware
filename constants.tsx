
import React from 'react';
import { 
  BookOpen, 
  MessageSquare, 
  PenTool, 
  ShieldCheck, 
  Lightbulb,
  FileText,
  Video,
  Settings,
  LogOut,
  Home,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  ChevronRight,
  Upload,
  BarChart3
} from 'lucide-react';
import { Module } from './types';

export const INITIAL_MODULES: Module[] = [
  {
    id: 'digcomp-1',
    title: 'Literasi Informasi & Data',
    topic: 'Mencari, menyaring, dan mengevaluasi data digital.',
    description: 'Kemampuan untuk mengidentifikasi, mencari, mengambil, menyimpan, mengatur, dan menganalisis informasi digital.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    content: 'Literasi informasi bukan sekadar mencari di Google. Ini melibatkan kemampuan untuk membedakan antara fakta dan hoax, serta memahami bagaimana algoritma pencarian bekerja untuk memberikan informasi kepada kita.',
    assignmentInstruction: 'Buatlah ringkasan tentang 3 cara memverifikasi kebenaran berita online.',
    icon: 'BookOpen',
    questions: [
      {
        id: 'q1',
        text: 'Manakah dari berikut ini yang merupakan ciri sumber informasi yang kredibel?',
        options: [
          { id: 'a', text: 'Judul yang sangat provokatif' },
          { id: 'b', text: 'Mencantumkan penulis dan referensi yang jelas' },
          { id: 'c', text: 'Tidak memiliki tanggal publikasi' },
          { id: 'd', text: 'Hanya tersedia di media sosial' }
        ],
        correctOptionId: 'b',
        // Fix: Added missing 'points' property to match QuizQuestion interface
        points: 10
      }
    ]
  },
  {
    id: 'digcomp-2',
    title: 'Komunikasi & Kolaborasi',
    topic: 'Berinteraksi melalui teknologi digital.',
    description: 'Berbagi melalui alat digital, mengelola identitas digital, dan netiket.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    content: 'Netiket adalah etika dalam berkomunikasi di dunia digital. Memahami cara berkolaborasi menggunakan alat seperti Google Workspace atau Teams adalah kunci di dunia kerja modern.',
    assignmentInstruction: 'Tuliskan 5 aturan utama netiket saat melakukan diskusi di forum formal.',
    icon: 'MessageSquare',
    questions: []
  },
  {
    id: 'digcomp-3',
    title: 'Pembuatan Konten Digital',
    topic: 'Menciptakan dan mengedit konten baru.',
    description: 'Mengekspresikan diri melalui media digital dan memahami hak cipta.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    content: 'Mencakup pengembangan, integrasi, dan penyusunan kembali konten digital. Memahami lisensi Creative Commons sangat penting di sini.',
    assignmentInstruction: 'Sebutkan perbedaan antara lisensi Copyright dan Creative Commons.',
    icon: 'PenTool',
    questions: []
  },
  {
    id: 'digcomp-4',
    title: 'Keamanan Digital',
    topic: 'Melindungi perangkat dan data pribadi.',
    description: 'Memahami risiko siber dan perlindungan kesehatan digital.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    content: 'Keamanan melibatkan perlindungan fisik perangkat serta keamanan data melalui enkripsi dan otentikasi dua faktor (2FA).',
    assignmentInstruction: 'Jelaskan langkah-langkah mengaktifkan 2FA pada akun Gmail Anda.',
    icon: 'ShieldCheck',
    questions: []
  },
  {
    id: 'digcomp-5',
    title: 'Penyelesaian Masalah',
    topic: 'Mengidentifikasi kebutuhan dan respon teknologi.',
    description: 'Menyelesaikan persoalan teknis dan memperbarui kompetensi diri.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    content: 'Kemampuan untuk mengidentifikasi masalah teknis saat menggunakan perangkat dan menemukan solusi kreatif menggunakan alat digital.',
    assignmentInstruction: 'Berikan solusi jika komputer Anda mengalami "Blue Screen" secara tiba-tiba.',
    icon: 'Lightbulb',
    questions: []
  }
];

export const IconMap: Record<string, React.ElementType> = {
  BookOpen,
  MessageSquare,
  PenTool,
  ShieldCheck,
  Lightbulb,
  FileText,
  Video,
  Settings,
  LogOut,
  Home,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  ChevronRight,
  Upload,
  BarChart3
};