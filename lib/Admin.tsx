
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Server, 
  Search, 
  Trash2, 
  Eye, 
  FileText,
  Lock,
  Unlock,
  Key,
  Wifi,
  Globe,
  Settings,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Link2,
  Terminal,
  Code,
  Palette,
  Image as ImageIcon,
  Upload,
  RefreshCcw
} from 'lucide-react';
import { ResumeData, AppConfig } from '../types';
import { 
    getSupabase, 
    updateSupabaseConfig, 
    getStoredProjectInfo, 
    updateProjectInfo,
    isSupabaseConfigured
} from '../lib/supabase';

interface AdminProps {
  resumes: ResumeData[];
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  appConfig: AppConfig;
  setAppConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const Admin: React.FC<AdminProps> = ({ resumes, onDelete, onView, appConfig, setAppConfig }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [verificationDetails, setVerificationDetails] = useState<string>('');
  const [showSchema, setShowSchema] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Branding States
  const [tempBranding, setTempBranding] = useState<AppConfig>(appConfig);

  // Config States
  const [config, setConfig] = useState({
    projectName: '',
    projectId: '',
    supabaseUrl: '',
    supabaseKey: ''
  });

  useEffect(() => {
    const info = getStoredProjectInfo();
    setConfig({
      projectName: info.name,
      projectId: info.id,
      supabaseUrl: localStorage.getItem('QW_SUPABASE_URL') || '',
      supabaseKey: localStorage.getItem('QW_SUPABASE_KEY') || ''
    });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'Trainer@2025' || passcode === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid admin credentials. Access denied.');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempBranding({ ...tempBranding, appLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveBranding = () => {
    setAppConfig(tempBranding);
    alert("System branding updated successfully!");
  };

  const verifyConnection = async () => {
    if (!isSupabaseConfigured()) {
        setConnectionStatus('error');
        setVerificationDetails('Incomplete configuration. Check URL and Key.');
        return;
    }

    setIsVerifying(true);
    try {
      const supabase = getSupabase();
      const { error, count } = await supabase.from('resumes').select('id', { count: 'exact', head: true });
      if (error) throw error;
      setConnectionStatus('success');
      setVerificationDetails(`Backend Server Healthy. Active Records: ${count ?? 0}`);
    } catch (err: any) {
      setConnectionStatus('error');
      setVerificationDetails(err.message || 'Network fetch failure.');
    } finally {
      setIsVerifying(false);
    }
  };

  const sqlSchema = `
-- BACKEND SCHEMA
CREATE TABLE resumes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lastModified TEXT,
  completion INTEGER,
  logo TEXT,
  logoAlignment TEXT,
  personalInfo JSONB,
  professionalSummary TEXT,
  coreExpertise JSONB,
  technicalSkills JSONB,
  experience JSONB,
  courses JSONB,
  certifications JSONB,
  education JSONB,
  testimonials JSONB,
  highlights JSONB,
  sections JSONB,
  user_id UUID REFERENCES auth.users(id)
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON resumes FOR SELECT USING (true);
CREATE POLICY "Public Upsert" ON resumes FOR ALL USING (true);
  `.trim();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Lock className="w-8 h-8" /></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Backend Access</h2>
          <p className="text-slate-500 mb-8">Access restricted to system administrators only.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="Enter system passcode" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {error && <p className="text-xs font-bold text-red-500">{error}</p>}
            <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2"><Unlock className="w-4 h-4" /> Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Infrastructure & Identity</h1>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"><Lock className="w-4 h-4" /> Lock Console</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branding Section */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900">App Branding & Identity</h3>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
              <img src={tempBranding.appLogo} alt="Preview" className="w-full h-full object-contain p-2" />
              <button 
                onClick={() => logoInputRef.current?.click()}
                className="absolute inset-0 bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Application Name</label>
                <input 
                  type="text" 
                  value={tempBranding.appName} 
                  onChange={e => setTempBranding({...tempBranding, appName: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" 
                  placeholder="e.g. Quantum Whale"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">App Slogan</label>
                <input 
                  type="text" 
                  value={tempBranding.appSlogan} 
                  onChange={e => setTempBranding({...tempBranding, appSlogan: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" 
                  placeholder="e.g. Infinite Learning"
                />
              </div>
            </div>
          </div>

          <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />

          <div className="pt-6 border-t border-slate-100 flex justify-end">
             <button 
                onClick={saveBranding} 
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Branding
              </button>
          </div>
        </section>

        {/* Server Config Section */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Link2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Backend Infrastructure</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Supabase URL</label><input type="text" value={config.supabaseUrl} onChange={e => setConfig({...config, supabaseUrl: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" /></div>
            <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Anon API Key</label><input type="password" value={config.supabaseKey} onChange={e => setConfig({...config, supabaseKey: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" /></div>
          </div>
          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
             <button onClick={() => setShowSchema(!showSchema)} className="text-xs font-bold text-blue-600 flex items-center gap-2 hover:underline"><Code className="w-4 h-4" /> View DB Schema</button>
             <button onClick={() => { updateSupabaseConfig(config.supabaseUrl, config.supabaseKey); verifyConnection(); }} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 flex items-center gap-2"><Save className="w-4 h-4" /> Deploy Backend</button>
          </div>
        </section>
      </div>

      {showSchema && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 animate-in slide-in-from-top-2">
           <div className="flex justify-between items-center mb-4">
             <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Database Definition</span>
             <button onClick={() => navigator.clipboard.writeText(sqlSchema)} className="text-[10px] text-white/50 hover:text-white uppercase font-bold">Copy SQL</button>
           </div>
           <pre className="text-[10px] text-slate-300 font-mono overflow-x-auto leading-relaxed">{sqlSchema}</pre>
        </div>
      )}

      {/* Dataset Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2"><Database className="w-4 h-4 text-blue-600" />Project Registry</h3>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Filter registry..." className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100"><th className="px-6 py-4">ID</th><th className="px-6 py-4">Profile Title</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Ops</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {resumes.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{r.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{r.name}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold">SYNCED</span></td>
                  <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => onView(r.id)} className="p-2 text-slate-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => onDelete(r.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
