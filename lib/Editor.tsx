
import React, { useState, useRef, useCallback } from 'react';
import { 
  User, 
  Briefcase, 
  Zap, 
  GraduationCap, 
  Award, 
  Plus,
  Trash2,
  BrainCircuit,
  LayoutTemplate,
  Target,
  BarChart3,
  Loader2,
  Sparkles,
  Download,
  X,
  Code2,
  BookOpen,
  MessageSquareQuote,
  Image as ImageIcon,
  UploadCloud,
  Printer,
  FileDown,
  ChevronUp,
  ChevronDown,
  Layout,
  ArrowRightLeft,
  GripVertical,
  Columns
} from 'lucide-react';
import { ResumeData, Education, Certification, TrainingExperience, Testimonial, Course, SectionOrder, INITIAL_SECTIONS } from '../types';
import { GoogleGenAI } from "@google/genai";

interface EditorProps {
  data: ResumeData;
  onChange: (data: Partial<ResumeData>) => void;
  onPreview: () => void;
  onGeneratePDF: (mode: 'print' | 'pdf') => void;
}

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  </div>
);

const Editor: React.FC<EditorProps> = ({ data, onChange, onPreview, onGeneratePDF }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showLayoutManager, setShowLayoutManager] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sections = data.sections || INITIAL_SECTIONS;

  const optimizeWithAI = async () => {
    if (!data.professionalSummary || data.professionalSummary.length < 20) {
      alert("Please write a short draft before optimizing.");
      return;
    }

    setIsOptimizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `As an expert resume writer for IT Trainers, rewrite the following professional summary to be more impactful, concise, and keyword-rich for the technical education industry: "${data.professionalSummary}"`,
        config: {
            systemInstruction: "You are a senior technical career coach. Output ONLY the polished summary text.",
            temperature: 0.7,
        }
      });
      
      const newSummary = response.text?.trim();
      if (newSummary) {
        onChange({ professionalSummary: newSummary });
      }
    } catch (err) {
      console.error("Gemini optimization failed:", err);
      alert("AI optimization failed. Please check your connection.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBadgeUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCertification(id, 'badge', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  // Layout Management Helpers
  const moveSection = (id: string, direction: 'up' | 'down') => {
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
      onChange({ sections: newSections });
    }
  };

  const cycleColumn = (id: string) => {
    const cols: Array<'top' | 'main' | 'side'> = ['top', 'main', 'side'];
    const newSections = sections.map(s => {
      if (s.id === id) {
        const nextCol = cols[(cols.indexOf(s.column) + 1) % cols.length];
        return { ...s, column: nextCol };
      }
      return s;
    });
    onChange({ sections: newSections });
  };

  // Generic Reorder Helper for content items
  const moveItem = <T extends { id: string }>(list: T[], id: string, direction: 'up' | 'down', callback: (newList: T[]) => void) => {
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === list.length - 1) return;

    const newList = [...list];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newList[idx], newList[targetIdx]] = [newList[targetIdx], newList[idx]];
    callback(newList);
  };

  // Education Helpers
  const addEducation = () => {
    const newEdu: Education = { id: Math.random().toString(36).substr(2, 9), degree: '', school: '', year: '' };
    onChange({ education: [...data.education, newEdu] });
  };
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({ education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e) });
  };
  const removeEducation = (id: string) => {
    onChange({ education: data.education.filter(e => e.id !== id) });
  };

  // Course Helpers
  const addCourse = () => {
    const newCourse: Course = { id: Math.random().toString(36).substr(2, 9), title: '', platform: '', year: '' };
    onChange({ courses: [...(data.courses || []), newCourse] });
  };
  const updateCourse = (id: string, field: keyof Course, value: string) => {
    onChange({ courses: (data.courses || []).map(c => c.id === id ? { ...c, [field]: value } : c) });
  };
  const removeCourse = (id: string) => {
    onChange({ courses: (data.courses || []).filter(c => c.id !== id) });
  };

  // Certification Helpers
  const addCertification = () => {
    const newCert: Certification = { id: Math.random().toString(36).substr(2, 9), name: '', issuer: '', date: '' };
    onChange({ certifications: [...data.certifications, newCert] });
  };
  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    onChange({ certifications: data.certifications.map(c => c.id === id ? { ...c, [field]: value } : c) });
  };
  const removeCertification = (id: string) => {
    onChange({ certifications: data.certifications.filter(c => c.id !== id) });
  };

  // Experience Helpers
  const addExperience = () => {
    const newExp: TrainingExperience = { id: Math.random().toString(36).substr(2, 9), company: '', role: '', startDate: '', endDate: '', description: '' };
    onChange({ experience: [...data.experience, newExp] });
  };
  const updateExperience = (id: string, field: keyof TrainingExperience, value: string) => {
    onChange({ experience: data.experience.map(e => e.id === id ? { ...e, [field]: value } : e) });
  };
  const removeExperience = (id: string) => {
    onChange({ experience: data.experience.filter(e => e.id !== id) });
  };

  // Testimonial Helpers
  const addTestimonial = () => {
    const newTest: Testimonial = { id: Math.random().toString(36).substr(2, 9), studentName: '', studentTitle: '', quote: '' };
    onChange({ testimonials: [...(data.testimonials || []), newTest] });
  };
  const updateTestimonial = (id: string, field: keyof Testimonial, value: string) => {
    onChange({ testimonials: (data.testimonials || []).map(t => t.id === id ? { ...t, [field]: value } : t) });
  };
  const removeTestimonial = (id: string) => {
    onChange({ testimonials: (data.testimonials || []).map(t => t).filter(t => t.id !== id) });
  };

  const formatMetricLabel = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  };

  return (
    <div className="animate-in fade-in duration-500 pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Build Your Resume</h1>
          <p className="text-slate-500 mt-1">Design a high-impact profile for technical training roles.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowLayoutManager(!showLayoutManager)}
            className={`px-5 py-2.5 border rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              showLayoutManager ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layout className="w-4 h-4" /> {showLayoutManager ? 'Editing Content' : 'Configure Layout'}
          </button>
          <button onClick={onPreview} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 shadow-sm transition-all">
            Full Preview
          </button>
        </div>
      </div>

      {showLayoutManager ? (
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm animate-in slide-in-from-top-4 duration-500">
           <SectionHeader icon={<Columns className="w-6 h-6" />} title="Resume Structure Manager" subtitle="Drag and reorder your resume sections across columns" />
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['top', 'main', 'side'].map((colType) => {
                const colSections = sections.filter(s => s.column === colType);
                return (
                  <div key={colType} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {colType === 'top' ? 'Full Width (Header Area)' : colType === 'main' ? 'Main Column (Left)' : 'Sidebar Column (Right)'}
                      </label>
                      <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-500">{colSections.length}</span>
                    </div>
                    
                    <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 min-h-[300px] flex flex-col gap-3">
                      {colSections.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-3xl opacity-40">
                          <Layout className="w-8 h-8 mb-2" />
                          <p className="text-xs font-medium">No sections here</p>
                        </div>
                      )}
                      {colSections.map((s, idx) => (
                        <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-all flex items-center justify-between">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="cursor-grab text-slate-300 group-hover:text-slate-400">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-slate-700 truncate">{s.label}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => cycleColumn(s.id)}
                              title="Move to next column"
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <ArrowRightLeft className="w-4 h-4" />
                            </button>
                            <div className="w-[1px] h-4 bg-slate-100 mx-1" />
                            <div className="flex flex-col gap-0.5">
                              <button 
                                disabled={idx === 0}
                                onClick={() => moveSection(s.id, 'up')}
                                className="p-1 text-slate-300 hover:text-blue-600 disabled:opacity-20"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                disabled={idx === colSections.length - 1}
                                onClick={() => moveSection(s.id, 'down')}
                                className="p-1 text-slate-300 hover:text-blue-600 disabled:opacity-20"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
           </div>

           <div className="mt-10 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-sm text-blue-700 font-medium leading-relaxed">
                Changes made here are applied in real-time. Use the **Switch Column** button to migrate modules between the high-impact zones of your resume.
              </p>
           </div>
        </section>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Logo & Branding */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <SectionHeader icon={<ImageIcon className="w-6 h-6" />} title="Branding & Logo" subtitle="Personalize your resume identity" />
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden relative group">
                {data.logo ? (
                  <>
                    <img src={data.logo} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                    <button 
                      onClick={() => onChange({ logo: undefined })}
                      className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-bold"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <UploadCloud className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">No Logo</p>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Add a professional logo or your company's emblem. Transparent PNG or SVG files work best. This will appear at the top center of your finalized resume.
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleLogoUpload} 
                  className="hidden" 
                  accept="image/*" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> {data.logo ? 'Change Logo' : 'Upload Logo'}
                </button>
              </div>
            </div>
          </section>

          {/* Personal Info */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <SectionHeader icon={<User className="w-6 h-6" />} title="Personal Details" subtitle="Contact and professional identification" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                <input type="text" value={data.personalInfo.fullName} onChange={e => updatePersonalInfo('fullName', e.target.value)} placeholder="e.g. Alex Rivera" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Title</label>
                <input type="text" value={data.personalInfo.professionalTitle} onChange={e => updatePersonalInfo('professionalTitle', e.target.value)} placeholder="e.g. Senior IT Trainer" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
                <input type="email" value={data.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} placeholder="alex@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location</label>
                <input type="text" value={data.personalInfo.location} onChange={e => updatePersonalInfo('location', e.target.value)} placeholder="Austin, TX" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <SectionHeader icon={<BrainCircuit className="w-6 h-6" />} title="Professional Summary" subtitle="Your unique training philosophy" />
              <button onClick={optimizeWithAI} disabled={isOptimizing} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 disabled:opacity-50">
                {isOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} AI Refine
              </button>
            </div>
            <textarea value={data.professionalSummary} onChange={e => onChange({ professionalSummary: e.target.value })} placeholder="Passionate educator specializing in..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[140px] resize-none" />
          </section>

          {/* Metrics */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <SectionHeader icon={<BarChart3 className="w-6 h-6" />} title="Impact Metrics" subtitle="Quantifiable results for employers" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(data.highlights).map(([key, value]) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{formatMetricLabel(key)}</label>
                  <input type="text" value={value} onChange={e => onChange({ highlights: { ...data.highlights, [key]: e.target.value } })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <SectionHeader icon={<Briefcase className="w-6 h-6" />} title="Experience" subtitle="Training history" />
              <button onClick={addExperience} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50"><Plus className="w-4 h-4" /> Add Experience</button>
            </div>
            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={exp.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 relative group transition-all hover:border-slate-300">
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      disabled={idx === 0}
                      onClick={() => moveItem(data.experience, exp.id, 'up', (newList) => onChange({ experience: newList }))} 
                      className="p-1.5 text-slate-400 hover:text-blue-600 disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button 
                      disabled={idx === data.experience.length - 1}
                      onClick={() => moveItem(data.experience, exp.id, 'down', (newList) => onChange({ experience: newList }))} 
                      className="p-1.5 text-slate-400 hover:text-blue-600 disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                    <button onClick={() => removeExperience(exp.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} placeholder="Role (e.g. Lead Instructor)" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none" />
                    <input type="text" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder="Company/Organization" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Start Date (e.g. Jan 2020)" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none" />
                    <input type="text" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="End Date (or Present)" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none" />
                  </div>
                  <textarea value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} placeholder="Key achievements and responsibilities..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm min-h-[100px] resize-none focus:border-blue-500 outline-none" />
                </div>
              ))}
            </div>
          </section>

          {/* Education & Certs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <SectionHeader icon={<GraduationCap className="w-6 h-6" />} title="Education" subtitle="Academic history" />
                <button onClick={addEducation} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                {data.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group">
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button disabled={idx === 0} onClick={() => moveItem(data.education, edu.id, 'up', (newList) => onChange({ education: newList }))} className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                      <button disabled={idx === data.education.length - 1} onClick={() => moveItem(data.education, edu.id, 'down', (newList) => onChange({ education: newList }))} className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                      <button onClick={() => removeEducation(edu.id)} className="p-1 text-slate-400 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                    </div>
                    <input type="text" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Degree/Course" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs mb-2" />
                    <div className="flex gap-2">
                      <input type="text" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} placeholder="University" className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs" />
                      <input type="text" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} placeholder="Year" className="w-20 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-center" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <SectionHeader icon={<Award className="w-6 h-6" />} title="Certifications" subtitle="Professional credentials" />
                <button onClick={addCertification} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                {data.certifications.map((cert, idx) => (
                  <div key={cert.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group">
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button disabled={idx === 0} onClick={() => moveItem(data.certifications, cert.id, 'up', (newList) => onChange({ certifications: newList }))} className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                      <button disabled={idx === data.certifications.length - 1} onClick={() => moveItem(data.certifications, cert.id, 'down', (newList) => onChange({ certifications: newList }))} className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                      <button onClick={() => removeCertification(cert.id)} className="p-1 text-slate-400 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 group/badge relative">
                        {cert.badge ? (
                          <>
                            <img src={cert.badge} alt="Badge" className="w-full h-full object-contain" />
                            <button 
                              onClick={() => updateCertification(cert.id, 'badge', undefined as any)}
                              className="absolute inset-0 bg-red-600/60 text-white opacity-0 group-hover/badge:opacity-100 flex items-center justify-center transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <label className="cursor-pointer text-center p-2 block w-full h-full">
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*" 
                              onChange={(e) => handleBadgeUpload(cert.id, e)}
                            />
                            <ImageIcon className="w-4 h-4 text-slate-300 mx-auto" />
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Badge</span>
                          </label>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input type="text" value={cert.name} onChange={e => updateCertification(cert.id, 'name', e.target.value)} placeholder="Cert Name" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs" />
                        <div className="flex gap-2">
                          <input type="text" value={cert.issuer} onChange={e => updateCertification(cert.id, 'issuer', e.target.value)} placeholder="Issuer" className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs" />
                          <input type="text" value={cert.date} onChange={e => updateCertification(cert.id, 'date', e.target.value)} placeholder="Date" className="w-20 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-center" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Student Testimonials */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <SectionHeader icon={<MessageSquareQuote className="w-6 h-6" />} title="Student Testimonials" subtitle="Social proof of your training impact" />
              <button onClick={addTestimonial} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50"><Plus className="w-4 h-4" /> Add Testimonial</button>
            </div>
            <div className="space-y-6">
              {(data.testimonials || []).map((test, idx) => (
                <div key={test.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 relative group transition-all hover:border-slate-300">
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button disabled={idx === 0} onClick={() => moveItem(data.testimonials || [], test.id, 'up', (newList) => onChange({ testimonials: newList }))} className="p-1.5 text-slate-400 hover:text-blue-600 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button disabled={idx === (data.testimonials || []).length - 1} onClick={() => moveItem(data.testimonials || [], test.id, 'down', (newList) => onChange({ testimonials: newList }))} className="p-1.5 text-slate-400 hover:text-blue-600 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                    <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                    <button onClick={() => removeTestimonial(test.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" value={test.studentName} onChange={e => updateTestimonial(test.id, 'studentName', e.target.value)} placeholder="Student Name" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none" />
                    <input type="text" value={test.studentTitle} onChange={e => updateTestimonial(test.id, 'studentTitle', e.target.value)} placeholder="Student Job Title / Company" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none" />
                  </div>
                  <textarea value={test.quote} onChange={e => updateTestimonial(test.id, 'quote', e.target.value)} placeholder="Student feedback quote..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm min-h-[80px] resize-none italic focus:border-blue-500 outline-none" />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Editor;
