import React from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Search, 
  FileCheck2, 
  CheckCircle2, 
  Database,
  Lock,
  Unlock,
  BookOpen
} from 'lucide-react';
import { SupabaseConfig } from '../types/exam';

interface HeaderProps {
  currentTab: 'student' | 'lookup' | 'teacher' | 'handbook';
  onSelectTab: (tab: 'student' | 'lookup' | 'teacher' | 'handbook') => void;
  isTeacherAuthenticated: boolean;
  onLogoutTeacher: () => void;
  supabaseConfig: SupabaseConfig;
  onOpenSupabaseConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isTeacherAuthenticated,
  onLogoutTeacher,
  supabaseConfig,
  onOpenSupabaseConfig,
}) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl border-b border-blue-900/50 sticky top-0 z-40">
      {/* Top institution bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-blue-800/40 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                  THPT HÒN ĐẤT
                </span>
                <span className="text-xs font-medium text-blue-300">
                  Tỉnh An Giang
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                HỆ THỐNG PHÒNG THI TRỰC TUYẾN
                <span className="text-xs font-mono font-bold bg-blue-600/60 text-blue-100 px-2 py-0.5 rounded-full border border-blue-400/30">
                  V11.2
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            <button
              onClick={onOpenSupabaseConfig}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all ${
                supabaseConfig.isConnected
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/60'
                  : 'bg-amber-950/60 text-amber-300 border-amber-600/40 hover:bg-amber-900/60'
              }`}
              title="Nhấn để cấu hình kết nối cơ sở dữ liệu Supabase"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="font-medium">
                {supabaseConfig.mode === 'cloud' ? 'Supabase Cloud' : 'Bộ nhớ V11.2 Đồng Bộ'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
              <span>Tác giả:</span>
              <span className="font-semibold text-white">Thầy Lê Bá Nhẫn</span>
            </div>

            {isTeacherAuthenticated && (
              <button
                onClick={onLogoutTeacher}
                className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-700 transition"
              >
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                <span>Thoát Quản Trị</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center justify-between overflow-x-auto py-2 scrollbar-none gap-2">
          <nav className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => onSelectTab('student')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentTab === 'student'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/40'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-300" />
              <span>Cổng Thí Sinh Làm Bài</span>
            </button>

            <button
              onClick={() => onSelectTab('lookup')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentTab === 'lookup'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/40'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-300" />
              <span>Tra Cứu Kết Quả</span>
            </button>

            <button
              onClick={() => onSelectTab('teacher')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentTab === 'teacher'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/40'
              }`}
            >
              {isTeacherAuthenticated ? (
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              ) : (
                <Lock className="w-4 h-4 text-amber-400" />
              )}
              <span>Khu Quản Trị Giáo Viên</span>
              {isTeacherAuthenticated && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('handbook')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentTab === 'handbook'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/40'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-300" />
              <span>Sổ Tay & 25 Tiêu Chí</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
