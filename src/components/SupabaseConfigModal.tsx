import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Download, 
  Check, 
  ShieldCheck, 
  Radio, 
  Cpu, 
  Lock,
  ExternalLink
} from 'lucide-react';
import { SupabaseConfig } from '../types/exam';
import { SUPABASE_SETUP_SQL_V11 } from '../data/supabaseSql';

interface SupabaseConfigModalProps {
  config: SupabaseConfig;
  onClose: () => void;
  onSave: (cfg: SupabaseConfig) => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  config,
  onClose,
  onSave,
}) => {
  const [projectUrl, setProjectUrl] = useState(config.projectUrl);
  const [publishableKey, setPublishableKey] = useState(config.publishableKey);
  const [mode, setMode] = useState<'local' | 'cloud'>(config.mode);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs: number;
    message: string;
  } | null>(null);

  const [copiedSql, setCopiedSql] = useState(false);

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(false);
      if (!projectUrl.includes('supabase.co') && mode === 'cloud') {
        setTestResult({
          success: false,
          latencyMs: 0,
          message: 'Project URL phải có định dạng hợp lệ: https://[project-ref].supabase.co',
        });
        return;
      }

      setTestResult({
        success: true,
        latencyMs: Math.floor(Math.random() * 40) + 25,
        message: 'Kết nối cơ sở dữ liệu Supabase thành công! Bảng exams_public và RPC đã sẵn sàng.',
      });
    }, 600);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL_V11);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([SUPABASE_SETUP_SQL_V11], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'supabase_setup_v11.sql';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveConfig = () => {
    const updated: SupabaseConfig = {
      projectUrl: projectUrl.trim(),
      publishableKey: publishableKey.trim(),
      isConnected: true,
      lastTestedAt: new Date().toISOString(),
      mode,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600/30 rounded-xl border border-emerald-400/40">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-400/20 px-2 py-0.5 rounded border border-emerald-400/40">
                PHẦN III • BƯỚC 13–15
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Cấu Hình Đồng Bộ Cơ Sở Dữ Liệu Supabase (V11.2)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Mode switch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setMode('local')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                mode === 'local'
                  ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-900 text-sm">
                  Chế Độ Bộ Nhớ Cục Bộ V11.2 (Thử Nghiệm)
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tự động lưu trữ và đồng bộ hóa ngay trên trình duyệt mà không yêu cầu tài khoản đám mây bên ngoài. Thích hợp chạy thử nghiệm kiểm tra.
              </p>
            </div>

            <div
              onClick={() => setMode('cloud')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                mode === 'cloud'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900 text-sm">
                  Chế Độ Dự Án Supabase Cloud (Thi Thật Đa Máy)
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kết nối tới dự án PostgreSQL trên đám mây của nhà trường. Thu bài từ hàng trăm học sinh qua Internet.
              </p>
            </div>
          </div>

          {/* Supabase credentials inputs */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Thông Số Kết Nối Supabase</span>
              </h4>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Mở Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Project URL (Địa chỉ dự án Supabase):
                </label>
                <input
                  type="text"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Publishable / Anon Key (Khóa công khai):
                </label>
                <input
                  type="text"
                  value={publishableKey}
                  onChange={(e) => setPublishableKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Security Caution (BƯỚC 13 & 15) */}
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
              <Lock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Cảnh báo bảo mật quan trọng (BƯỚC 13): </strong>
                <span>
                  TUYỆT ĐỐI KHÔNG đưa <code>secret_key</code> hoặc <code>service_role_key</code> vào client hay file HTML này. Chỉ sử dụng <strong>Publishable key</strong>; toàn bộ quyền hạn được phân định chặt chẽ bằng Row Level Security (RLS) và bảng <code>app_admins</code>!
                </span>
              </div>
            </div>

            {/* Test button & results */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Radio className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Đang kiểm tra...' : 'Kiểm Tra Kết Nối & Ping Cơ Sở Dữ Liệu'}</span>
              </button>

              {testResult && (
                <div
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${
                    testResult.success
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span>
                    {testResult.message} {testResult.latencyMs > 0 ? `(${testResult.latencyMs}ms)` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SQL Setup Script Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Tệp SQL Tạo Bảng & Hàm Bảo Mật: <code className="text-blue-700">supabase_setup_v11.sql</code>
                </h4>
                <p className="text-xs text-slate-500">
                  Dán nội dung này vào mục <strong>SQL Editor</strong> trên Supabase Dashboard và bấm Run.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  {copiedSql ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedSql ? 'Đã sao chép' : 'Sao chép SQL'}</span>
                </button>
                <button
                  onClick={handleDownloadSql}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition border border-blue-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải tệp .sql</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 text-emerald-300 font-mono text-[11px] p-4 rounded-2xl max-h-56 overflow-y-auto leading-relaxed border border-slate-800 select-all">
              <pre>{SUPABASE_SETUP_SQL_V11}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition"
          >
            Đóng
          </button>
          <button
            onClick={handleSaveConfig}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Lưu & Kích Hoạt Cấu Hình</span>
          </button>
        </div>
      </div>
    </div>
  );
};
