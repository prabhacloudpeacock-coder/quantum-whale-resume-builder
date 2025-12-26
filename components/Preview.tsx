
import React, { useState, useMemo, useCallback } from 'react';
import { 
  Download, 
  Mail,
  MapPin,
  Eye,
  Sparkles,
  Zap,
  Code2,
  MessageSquareQuote,
  Target,
  BarChart3,
  Briefcase,
  Award,
  GraduationCap,
  Cpu,
  AlignLeft,
  AlignCenter,
  AlignRight,
  BookOpen,
  Globe,
  FileText,
  Phone,
  Cloud,
  Terminal,
  ShieldCheck,
  Database,
  ChevronUp,
  ChevronDown,
  Layout,
  ArrowRightLeft
} from 'lucide-react';
import { ResumeData, SectionOrder, INITIAL_SECTIONS } from '../types';

const PRESETS = [
  { id: 'bold', name: 'Bold Professional', color: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600' },
  { id: 'minimalist', name: 'Minimalist', color: 'bg-slate-900', text: 'text-slate-900', border: 'border-slate-900' },
  { id: 'creative', name: 'Creative Tech', color: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-600' }
];

interface PreviewProps {
  data: ResumeData;
  onGeneratePDF: (mode: 'print' | 'pdf') => void;
  onUpdate?: (data: Partial<ResumeData>) => void;
  selectedPreset: string;
  onPresetChange: (preset: string) => void;
}

const Preview: React.FC<PreviewProps> = ({ data, onGeneratePDF, onUpdate, selectedPreset, onPresetChange }) => {
  const sections = useMemo(() => data.sections || INITIAL_SECTIONS, [data.sections]);
  const [logoAlign, setLogoAlign] = useState<'left' | 'center' | 'right'>(data.logoAlignment || 'left');

  const preset = useMemo(() => PRESETS.find(p => p.id === selectedPreset) || PRESETS[0], [selectedPreset]);

  const toggleAlignment = (align: 'left' | 'center' | 'right') => {
    setLogoAlign(align);
    if (onUpdate) onUpdate({ logoAlignment: align });
  };

  const formatMetricLabel = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  };

  const moveSection = useCallback((id: string, direction: 'up' | 'down') => {
    if (!onUpdate) return;
    
    const currentIndex = sections.findIndex(s => s.id === id);
    if (currentIndex === -1) return;

    const column = sections[currentIndex].column;
    const sameColumnSections = sections.filter(s => s.column === column);
    const indexInColumn = sameColumnSections.findIndex(s => s.id === id);

    let targetGlobalIndex = -1;
    if (direction === 'up' && indexInColumn > 0) {
      const targetId = sameColumnSections[indexInColumn - 1].id;
      targetGlobalIndex = sections.findIndex(s => s.id === targetId);
    } else if (direction === 'down' && indexInColumn < sameColumnSections.length - 1) {
      const targetId = sameColumnSections[indexInColumn + 1].id;
      targetGlobalIndex = sections.findIndex(s => s.id === targetId);
    }

    if (targetGlobalIndex !== -1) {
      const newSections = [...sections];
      const temp = newSections[currentIndex];
      newSections[currentIndex] = newSections[targetGlobalIndex];
      newSections[targetGlobalIndex] = temp;
      onUpdate({ sections: newSections });
    }
  }, [sections, onUpdate]);

  const changeColumn = useCallback((id: string) => {
    if (!onUpdate) return;
    const cols: Array<'top' | 'main' | 'side'> = ['top', 'main', 'side'];
    const newSections = sections.map(s => {
      if (s.id === id) {
        const nextCol = cols[(cols.indexOf(s.column) + 1) % cols.length];
        return { ...s, column: nextCol };
      }
      return s;
    });
    onUpdate({ sections: newSections });
  }, [sections, onUpdate]);

  const getSkillIcon = (skill: string) => {
    const s = skill.toLowerCase();
    if (s.includes('aws') || s.includes('azure') || s.includes('cloud') || s.includes('gcp')) return <Cloud className="w-3 h-3" />;
    if (s.includes('code') || s.includes('javascript') || s.includes('python')) return <Code2 className="w-3 h-3" />;
    if (s.includes('linux') || s.includes('bash') || s.includes('terminal')) return <Terminal className="w-3 h-3" />;
    if (s.includes('docker') || s.includes('kubernetes')) return <Cpu className="w-3 h-3" />;
    if (s.includes('sql') || s.includes('db') || s.includes('database')) return <Database className="w-3 h-3" />;
    if (s.includes('security') || s.includes('shield')) return <ShieldCheck className="w-3 h-3" />;
    return <Zap className="w-3 h-3" />;
  };

  const renderSectionHeader = (label: string) => (
    <div className="flex items-center gap-3 mb-5">
      <h2 className={`text-[11px] font-black uppercase tracking-[0.2em] ${preset.text} whitespace-nowrap`}>{label}</h2>
      <div className={`flex-1 h-[1px] ${selectedPreset === 'minimalist' ? 'bg-slate-100' : 'bg-slate-200'}`} />
    </div>
  );

  const renderSectionContent = (s: SectionOrder) => {
    const { id, label } = s;
    switch (id) {
      case 'summary':
        return (
          <section key={id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderSectionHeader(label)}
            <p className="text-[13px] text-slate-600 leading-relaxed text-justify">{data.professionalSummary}</p>
          </section>
        );
      case 'highlights':
        return (
          <section key={id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderSectionHeader(label)}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(data.highlights).map(([key, value]) => (
                <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center transition-all hover:bg-white hover:shadow-sm">
                  <p className={`text-base font-black ${preset.text}`}>{value}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{formatMetricLabel(key)}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'experience':
        return (
          <section key={id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderSectionHeader(label)}
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="experience-item">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="text-[14px] font-bold text-slate-900">{exp.role}</h3>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <p className={`text-[11px] font-bold ${preset.text} mb-2 uppercase tracking-wider`}>{exp.company}</p>
                  <p className="text-[13px] text-slate-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'testimonials':
        if (!data.testimonials?.length) return null;
        return (
          <section key={id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderSectionHeader(label)}
            <div className="space-y-3">
              {data.testimonials.map((test) => (
                <div key={test.id} className="bg-slate-50/50 p-4 rounded-xl border-l-[3px] border-slate-200">
                  <p className="text-[13px] text-slate-600 italic leading-relaxed mb-3">"{test.quote}"</p>
                  <div className="flex items-center gap-2">
                     <div className={`w-1.5 h-1.5 rounded-full ${preset.color}`} />
                     <p className="text-[11px] font-bold text-slate-900">{test.studentName}, <span className="text-slate-400 font-normal">{test.studentTitle}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        return (
          <section key={id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderSectionHeader(label)}
            <div className="flex flex-wrap gap-1.5">
              {data.technicalSkills.map((skill, i) => (
                <span key={i} className={`flex items-center gap-1 px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider shadow-sm transition-transform hover:scale-105 ${
                  selectedPreset === 'minimalist' ? 'bg-slate-100 text-slate-600 border border-slate-200' : `${preset.color} text-white`
                }`}>
                  {getSkillIcon(skill)}
                  {skill}
                </span>
              ))}
            </div>
          </section>
        );
      case 'certs':
        return (
          <section key={id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderSectionHeader(label)}
            <div className="space-y-4">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="certification-item flex gap-3 items-center transition-all hover:bg-slate-50 p-1 rounded-lg -m-1">
                  {cert.badge && (
                    <div className="w-10 h-10 flex-shrink-0 bg-white rounded flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden">
                       <img src={cert.badge} alt="Digital Badge" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div>
                    <p className="text-[12px] font-bold text-slate-900 leading-tight">{cert.name}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-widest font-bold">{cert.issuer} | {cert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'courses':
        if (!data.courses?.length) return null;
        return (
          <section key={id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderSectionHeader(label)}
            <div className="space-y-3">
              {data.courses.map((course) => (
                <div key={course.id} className="course-item">
                  <p className="text-[12px] font-bold text-slate-900 leading-tight">{course.title}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">{course.platform} | {course.year}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'edu':
        return (
          <section key={id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderSectionHeader(label)}
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="education-item">
                  <p className="text-[12px] font-bold text-slate-900 leading-tight">{edu.degree}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-widest font-bold">{edu.school} | {edu.year}</p>
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700 pb-20">
      {/* Configuration Sidebar */}
      <aside className="w-full lg:w-80 space-y-6 no-print">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
          {/* Export Group */}
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4 text-sm">
              <Download className="w-4 h-4 text-blue-600" />
              Document Action
            </h3>
            <button 
              onClick={() => onGeneratePDF('pdf')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
            >
              Generate Official PDF
            </button>
          </div>

          <div className="w-full h-[1px] bg-slate-100" />

          {/* Theme Engine */}
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4 text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Theme Engine
            </h3>
            <div className="grid grid-cols-1 gap-2">
                {PRESETS.map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => onPresetChange(p.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                      selectedPreset === p.id 
                        ? `${p.border} bg-slate-50 text-slate-900 shadow-sm border-2` 
                        : 'border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <span className="text-[11px] font-bold">{p.name}</span>
                    <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                  </button>
                ))}
            </div>
          </div>

          {/* Module Priority (Rearrange) */}
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4 text-sm">
              <Layout className="w-4 h-4 text-blue-600" />
              Module Priority
            </h3>
            <div className="space-y-6">
              {['top', 'main', 'side'].map(col => {
                const colSections = sections.filter(s => s.column === col);
                return (
                  <div key={col} className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{col} Assignment</label>
                    <div className="space-y-1">
                      {colSections.length === 0 && (
                        <div className="p-3 text-[10px] text-slate-400 border border-dashed border-slate-200 rounded-xl text-center italic">
                          No sections in this zone
                        </div>
                      )}
                      {colSections.map((s, idx) => (
                        <div key={s.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg group transition-all hover:bg-slate-100">
                          <span className="text-[10px] font-bold text-slate-600 truncate mr-2">{s.label}</span>
                          <div className="flex gap-1 items-center">
                            <button 
                              onClick={() => changeColumn(s.id)}
                              className="p-1 text-slate-300 hover:text-indigo-600 transition-colors"
                              title="Migrate to next column"
                            >
                              <ArrowRightLeft className="w-2.5 h-2.5" />
                            </button>
                            <div className="w-[1px] h-3 bg-slate-200 mx-0.5" />
                            <button 
                              disabled={idx === 0}
                              onClick={() => moveSection(s.id, 'up')}
                              className="p-1 text-slate-300 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button 
                              disabled={idx === colSections.length - 1}
                              onClick={() => moveSection(s.id, 'down')}
                              className="p-1 text-slate-300 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* Resume Canvas (A4 Dimensions) */}
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <div 
          className="resume-canvas bg-white shadow-2xl rounded-sm mx-auto overflow-hidden transition-all duration-500 ring-1 ring-slate-100 print:shadow-none print:ring-0"
          style={{ width: '210mm', minHeight: '297mm', padding: '15mm 20mm' }}
        >
          {/* Header */}
          <header 
            className={`pb-8 mb-8 border-b-4 ${preset.border} ${
              logoAlign === 'center' ? 'text-center' : logoAlign === 'right' ? 'text-right' : 'text-left'
            } transition-all duration-500`}
          >
            {data.logo && (
              <div className={`mb-5 flex ${logoAlign === 'center' ? 'justify-center' : logoAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                <img src={data.logo} alt="Logo" className="h-16 w-auto object-contain transition-transform hover:scale-105" />
              </div>
            )}
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1">{data.personalInfo.fullName}</h1>
            <p className={`text-base font-bold ${preset.text} tracking-widest uppercase`}>{data.personalInfo.professionalTitle}</p>
            
            <div className={`flex flex-wrap gap-x-5 gap-y-1 mt-5 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${
              logoAlign === 'center' ? 'justify-center' : logoAlign === 'right' ? 'justify-end' : 'justify-start'
            }`}>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {data.personalInfo.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {data.personalInfo.mobileNumber}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {data.personalInfo.location}</span>
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> {data.personalInfo.linkedInProfile}</span>
            </div>
          </header>

          <div className="space-y-10">
            {/* Top Sections */}
            {sections.filter(s => s.column === 'top').map(s => renderSectionContent(s))}

            {/* Split Content Alignment Logic */}
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-1 space-y-10">
                {sections.filter(s => s.column === 'main').map(s => renderSectionContent(s))}
              </div>
              <div className="w-full md:w-[240px] space-y-10">
                {sections.filter(s => s.column === 'side').map(s => renderSectionContent(s))}
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-8 bg-blue-600 text-white p-4 rounded-2xl flex items-center justify-between no-print shadow-xl shadow-blue-500/20 max-w-[210mm] mx-auto">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Eye className="w-4 h-4" />
             </div>
             <div>
                <p className="text-xs font-black tracking-tight uppercase italic">A4 High-Fidelity Preview</p>
                <p className="text-[9px] opacity-80 uppercase font-bold tracking-[0.2em]">{preset.name} active</p>
             </div>
          </div>
          <div className="flex gap-2">
             <button onClick={() => onGeneratePDF('print')} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/20">
                Print
             </button>
             <button onClick={() => onGeneratePDF('pdf')} className="px-4 py-2 bg-white text-blue-600 hover:bg-slate-50 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
                PDF
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
