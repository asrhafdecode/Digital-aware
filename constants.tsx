
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
    videoDescription: 'Video pengantar tentang pentingnya mencari, menyaring, dan mengevaluasi informasi serta data digital dengan bijak.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfDescription: 'Dokumen ini berisi panduan teknis mengenai metode verifikasi data dan teknik pencarian informasi tingkat lanjut.',
    content: 'Literasi informasi bukan sekadar mencari di Google.',
    contentBlocks: [
      { id: 'b1', type: 'text', value: 'Literasi informasi bukan sekadar mencari di Google. Ini melibatkan kemampuan untuk membedakan antara fakta dan hoax, serta memahami bagaimana algoritma pencarian bekerja untuk memberikan informasi kepada kita.' },
      { id: 'b2', type: 'image', value: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800' },
      { id: 'b3', type: 'text', value: 'Dengan memahami literasi data, kita dapat mengambil keputusan yang lebih baik berdasarkan informasi yang akurat dan terpercaya.' }
    ],
    assignmentInstruction: 'Buatlah ringkasan tentang 3 cara memverifikasi kebenaran berita online.',
    icon: 'BookOpen',
    questions: [
      {
        id: 'q1',
        text: 'Manakah dari berikut ini yang merupakan ciri sumber informasi yang kredibel?',
        options: [
          { id: 'a', text: 'Judul yang sangat provokatif' },
          { id: 'b', text: 'Mencantumkan penulis and referensi yang jelas' },
          { id: 'c', text: 'Tidak memiliki tanggal publikasi' },
          { id: 'd', text: 'Hanya tersedia di media sosial' }
        ],
        correctOptionId: 'b',
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
    videoDescription: 'Penjelasan mengenai etika berkomunikasi (netiket) dan pemanfaatan perangkat digital untuk kolaborasi yang efektif.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfDescription: 'Materi PDF ini menjelaskan protokol komunikasi digital dan penggunaan alat kolaborasi daring.',
    content: 'Netiket adalah etika dalam berkomunikasi di dunia digital.',
    contentBlocks: [
      { id: 'b1', type: 'text', value: 'Netiket adalah etika dalam berkomunikasi di dunia digital. Memahami cara berkolaborasi menggunakan alat seperti Google Workspace atau Teams adalah kunci di dunia kerja modern.' },
      { id: 'b2', type: 'image', value: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800' }
    ],
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
    videoDescription: 'Panduan dasar membuat konten digital yang kreatif serta pemahaman pentingnya lisensi dan hak cipta.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfDescription: 'Modul ini merinci langkah-langkah pembuatan konten multimedia dan aspek hukum hak kekayaan intelektual.',
    content: 'Mencakup pengembangan, integrasi, dan penyusunan kembali konten digital.',
    contentBlocks: [
      { id: 'b1', type: 'text', value: 'Mencakup pengembangan, integrasi, dan penyusunan kembali konten digital. Memahami lisensi Creative Commons sangat penting di sini.' }
    ],
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
    videoDescription: 'Materi tentang cara mengamankan data pribadi, perangkat, serta menjaga kesehatan mental dan fisik di lingkungan digital.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfDescription: 'Bacaan ini fokus pada keamanan data pribadi, proteksi perangkat, dan kesehatan digital.',
    content: 'Keamanan melibatkan perlindungan fisik perangkat serta keamanan data.',
    contentBlocks: [
      { id: 'b1', type: 'text', value: 'Keamanan melibatkan perlindungan fisik perangkat serta keamanan data melalui enkripsi dan otentikasi dua faktor (2FA).' }
    ],
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
    videoDescription: 'Strategi dalam mengidentifikasi masalah teknis dan memilih solusi teknologi yang tepat untuk kebutuhan spesifik.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfDescription: 'Dokumen ini menyajikan kerangka kerja untuk pemecahan masalah teknis secara sistematis.',
    content: 'Kemampuan untuk mengidentifikasi masalah teknis saat menggunakan perangkat.',
    contentBlocks: [
      { id: 'b1', type: 'text', value: 'Kemampuan untuk mengidentifikasi masalah teknis saat menggunakan perangkat dan menemukan solusi kreatif menggunakan alat digital.' }
    ],
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
