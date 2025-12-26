
import React, { useRef, useState } from 'react';
import { 
  FileText, 
  Target, 
  Edit3, 
  Eye, 
  Plus,
  Trash2,
  Clock,
  Sparkles,
  FileJson,
  Wand2,
  FileUp,
  Globe,
  Waves,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ResumeData, AppConfig } from '../types';

interface DashboardProps {
  resumes: ResumeData[];
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onNew: () => void;
  onGenerateAI: () => void;
  onUpload: (file: File) => void;
  onImportJson: (data: ResumeData) => void;
  appConfig: AppConfig;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  resumes, 
  onEdit, 
  onPreview, 
  onNew, 
  onGenerateAI, 
  onUpload,
  onImportJson,
  appConfig
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          onImportJson(data);
        } catch (err) {
          alert("Invalid format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* QUICK ACTIONS NODES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-200 hover:border-blue-500 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.12)] transition-all cursor-pointer overflow-hidden"
        >
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileUp className="w-24 h-24" />
          </div>
          <div className="relative z-10 flex items-center gap-8">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner ring-1 ring-blue-100">
              <FileUp className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2 uppercase">Quantum Vision Parse</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">Scan any resume screenshot or JPG. Our AI neural layer maps technical training cycles instantly.</p>
            </div>
            <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>

        <div 
          onClick={() => jsonInputRef.current?.click()}
          className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-200 hover:border-emerald-500 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.12)] transition-all cursor-pointer overflow-hidden"
        >
          <input type="file" ref={jsonInputRef} onChange={handleJsonUpload} className="hidden" accept=".json" />
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileJson className="w-24 h-24" />
          </div>
          <div className="relative z-10 flex items-center gap-8">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner ring-1 ring-emerald-100">
              <FileJson className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2 uppercase">Restore Session</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">Hot-reload a previous project. Import local JSON schema to continue pedagogical refinement.</p>
            </div>
            <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Profiles', val: resumes.length, icon: Layers, color: 'blue' },
          { label: 'Training Efficacy', val: '98%', icon: TrendingUp, color: 'orange' },
          { label: 'Cloud Node Sync', val: 'Live', icon: Globe, color: 'emerald' },
          { label: 'Mastery Score', val: 'Infinite', icon: Cpu, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <div className={`bg-${stat.color}-50 p-2.5 rounded-xl`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
            </div>
            <h3 className="text-3xl font-black mt-6 text-slate-900 tracking-tighter">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* PROJECT LIST */}
      <div className="space-y-8 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic flex items-center gap-3">
             <Waves className="w-6 h-6 text-blue-600" /> Ocean of Projects
          </h2>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
            {resumes.length} Records Found
          </span>
        </div>
        
        {resumes.length === 0 ? (
          <div className="bg-slate-50 rounded-[3rem] p-32 text-center border-2 border-dashed border-slate-200/60 animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl ring-1 ring-slate-100">
               <FileText className="w-10 h-10 text-slate-200" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Calm Waters</h3>
             <p className="text-slate-500 mt-4 max-w-sm mx-auto text-lg font-medium">No profile data detected in this node. Use AI Smart Generate to spawn your first professional artifact.</p>
             <button onClick={onNew} className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
               Initialize First Node
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes.map(resume => (
              <div key={resume.id} className="group bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-200 hover:-translate-y-1.5 transition-all p-8 relative overflow-hidden">
                
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-full h-1.5 transition-colors ${resume.completion > 90 ? 'bg-emerald-500' : 'bg-blue-500'}`} />

                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
                    <img src={appConfig.appLogo} alt="Logo" className="w-11 h-11 object-contain invert grayscale brightness-200" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-black text-slate-900 text-xl tracking-tight leading-tight truncate uppercase italic">{resume.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{resume.lastModified}</span>
                    </div>
                  </div>
                </div>

                {/* Metadata Snippets */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Modules</p>
                    <p className="text-sm font-bold text-slate-900">{resume.experience.length} Years Exp</p>
                  </div>
                  <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Skills</p>
                    <p className="text-sm font-bold text-slate-900">{resume.technicalSkills.length} Stack Nodes</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pedagogical Depth</span>
                    <span className="text-sm font-black text-blue-600">{resume.completion}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-lg" style={{ width: `${resume.completion}%` }} />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => onEdit(resume.id)} 
                    className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                  >
                    <Edit3 className="w-4 h-4" /> Initialize Editor
                  </button>
                  <button 
                    onClick={() => onPreview(resume.id)} 
                    className="p-4 bg-slate-100 text-slate-900 rounded-2xl hover:bg-slate-200 transition-all border border-slate-100 active:scale-95"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
