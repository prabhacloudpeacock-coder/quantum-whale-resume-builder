// This is a new version of the file
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PenTool, 
  Eye, 
  Plus, 
  ShieldCheck, 
  RefreshCw,
  Loader2,
  Printer,
  Download,
  FileCheck,
  AlertCircle,
  FolderDown,
  Cloud,
  CloudOff,
  X,
  Sparkles,
  Zap,
  Wand2,
  BrainCircuit,
  Waves,
  Palette
} from 'lucide-react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  pdf
} from '@react-pdf/renderer';
// import Dashboard from './components/Dashboard';
// import Editor from './components/Editor';
// import Preview from './components/Preview';
// import Admin from './components/Admin';
// import { ResumeData, AppTab, SectionOrder, AppConfig, INITIAL_SECTIONS } from './types';
// import { usePersistence } from './hooks/usePersistence';
import { GoogleGenAI, Type } from "@google/genai";

// Quantum Whale High-Fidelity Logo (Fallback)
const DEFAULT_LOGO_SVG = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnR3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxlbnRvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDA2YWFmIi8+CiAgICAgIDxlbnRvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDI4NGYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxjaXJjbGUgY3g9IjI1MCIgY3k9IjI1MCIgcj0iMjQwIiBmaWxsPSJ1cmwoI2JnR3JhZCkiLz4KICA8IS0tIEluZmluaXR5IFN5bWJvbCAtLT4KICA8cGF0aCBkPSJNMTYwLDI1MCBjMCwtNjAgODAsLTYwIDgwLDAgczgwLDYwIDgwLDAgcy04MCwtNjAgLTgwLDAgcy04MCw2MCAtODAsMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDBiNWMxIiBzdHJva2Utd2lkdGg9IjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIG9wYWNpdHk9IjAuOCIvPgogIDwhLS0gV2hhbGUgU2lsaG91ZXR0ZSAtLT4KICA8cGF0aCBkPSJNMzgwLDI1MCBjLTQwLC00MCAtMTIwLC02MCAtMTgwLC0yMCBjLTIwLDEwIC00MCw0MCAtNjAsNDAgYy0yMCwwIC0zMCwtMTUgLTMwLC0xNSBjMCwwIDEwLDEwIDIwLDEwIGMzMCwwIDQwLC0zMCA3MCwtNDAgYzgwLC0zMCAxNTAsMTAgMTgwLDUwIGMzMCw0MCAxMCw4MCAtMjAsOTAgYzQwLDAgNjAsLTMwIDYwLC03MCBaIiBmaWxsPSJ3aGl0ZSIvPgogIDxwYXRoIGQ9Ik0xODAsMjAwIGMtMTAsMCAtMjAsMTAgLTMwLDE1IGMyMCwtMTAgNDAsLTE1IDYwLC01IFoiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjUiLz4KICA8dGV4dCB4PSIyNTAiIHk9IjM4MCIgZm9udC1mYW1pbHk9IidJbnRlcicsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iOTAwIiBsZXR0ZXItc3BhY2luZz0iLTEiPlF1YW50dW1XaGFsZTwvdGV4dD4KICA8dGV4dCB4PSIyNTAiIHk9IjQyMCIgZm9udC1mYW1pbHk9IidJbnRlcicsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBvcGFjaXR5PSIwLjkiIGZvbnQtd2VpZ2h0PSI1MDAiIGxldHRlci1zcGFjaW5nPSIzIj5JTkZJTklURSBMRUFSTklORzwvdGV4dD4KPC9zdmc+`;

// const getPdfStyles = (preset = 'bold', alignment: 'left' | 'center' | 'right' = 'left') => {
//   const primaryColor = preset === 'bold' ? '#004b8d' : preset === 'creative' ? '#4f46e5' : '#1e293b';
//   const accentColor = preset === 'minimalist' ? '#e2e8f0' : preset === 'creative' ? '#818cf8' : '#cbd5e1';
//   const justify = alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start';
  
//   return StyleSheet.create({
//     page: { 
//       padding: '40pt', 
//       backgroundColor: '#ffffff', 
//       fontFamily: 'Helvetica',
//       fontSize: 10,
//       color: '#334155'
//     },
//     header: { 
//       borderBottomWidth: preset === 'minimalist' ? 1 : 4, 
//       borderBottomColor: primaryColor, 
//       paddingBottom: 20, 
//       marginBottom: 25, 
//       textAlign: alignment as any 
//     },
//     logoArea: { marginBottom: 12, flexDirection: 'row', justifyContent: justify },
//     logo: { width: 60, height: 60 },
//     name: { 
//       fontSize: 28, 
//       fontWeight: 'bold', 
//       color: '#0f172a', 
//       textTransform: 'uppercase', 
//       letterSpacing: -0.5,
//       marginBottom: 2 
//     },
//     title: { 
//       fontSize: 12, 
//       color: primaryColor, 
//       fontWeight: 'bold', 
//       textTransform: 'uppercase',
//       letterSpacing: 1.5
//     },
//     contactBar: { 
//       flexDirection: 'row', 
//       justifyContent: justify, 
//       marginTop: 15, 
//       fontSize: 8, 
//       color: '#64748b',
//       flexWrap: 'wrap'
//     },
//     contactItem: { marginLeft: 8, marginRight: 8, marginBottom: 4 },
//     section: { marginBottom: 25 },
//     sectionHeaderRow: { 
//       flexDirection: 'row', 
//       alignItems: 'center', 
//       marginBottom: 15
//     },
//     sectionTitle: { 
//       fontSize: 10, 
//       fontWeight: 'bold', 
//       color: '#0f172a', 
//       textTransform: 'uppercase',
//       letterSpacing: 1.5,
//       marginRight: 10
//     },
//     sectionLine: { 
//       flex: 1, 
//       height: 1, 
//       backgroundColor: accentColor 
//     },
//     summary: { fontSize: 9.5, lineHeight: 1.6, textAlign: 'justify' },
//     metricsRow: { flexDirection: 'row', marginBottom: 10, flexWrap: 'wrap' },
//     metricBox: { 
//       flex: 1, 
//       minWidth: '15%',
//       backgroundColor: preset === 'minimalist' ? '#ffffff' : '#f8fafc', 
//       padding: 10, 
//       borderRadius: 4, 
//       borderWidth: 1, 
//       borderColor: '#e2e8f0', 
//       textAlign: 'center', 
//       margin: 4 
//     },
//     metricValue: { fontSize: 13, fontWeight: 'bold', color: primaryColor },
//     metricLabel: { fontSize: 5.5, color: '#94a3b8', textTransform: 'uppercase', marginTop: 2, fontWeight: 'bold' },
//     expItem: { marginBottom: 18 },
//     expHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
//     expRole: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
//     expDate: { fontSize: 7.5, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' },
//     expCompany: { fontSize: 9.5, color: primaryColor, fontWeight: 'bold', marginBottom: 6 },
//     expDesc: { fontSize: 9, color: '#475569', lineHeight: 1.6 },
//     gridContainer: { flexDirection: 'row', alignItems: 'flex-start' },
//     gridColMain: { flex: 1.7, marginRight: 25 },
//     gridColSide: { flex: 1 },
//     skillsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
//     skillTag: { 
//       backgroundColor: preset === 'minimalist' ? '#ffffff' : primaryColor, 
//       color: preset === 'minimalist' ? primaryColor : '#ffffff', 
//       paddingTop: 4, 
//       paddingBottom: 4, 
//       paddingLeft: 8, 
//       paddingRight: 8, 
//       borderRadius: 3, 
//       fontSize: 8, 
//       marginBottom: 6, 
//       marginRight: 6, 
//       fontWeight: 'bold', 
//       borderWidth: 1, 
//       borderColor: primaryColor 
//     },
//     certItem: { marginBottom: 15, flexDirection: 'row', alignItems: 'center' },
//     certBadge: { width: 30, height: 30, marginRight: 12, borderRadius: 3 },
//     certContent: { flex: 1 },
//     certName: { fontSize: 9.5, fontWeight: 'bold', color: '#0f172a' },
//     certIssuer: { fontSize: 8, color: '#64748b', marginTop: 2 },
//     testimonialItem: { 
//       marginBottom: 15, 
//       padding: 15, 
//       backgroundColor: preset === 'creative' ? '#eef2ff' : '#f8fafc', 
//       borderLeftWidth: 4, 
//       borderLeftColor: primaryColor,
//       borderRadius: 4
//     },
//     testimonialQuote: { fontSize: 9.5, color: '#334155', fontStyle: 'italic', marginBottom: 8, lineHeight: 1.5 },
//     testimonialAuthor: { fontSize: 8.5, fontWeight: 'bold', color: '#0f172a' }
//   });
// };

// const ResumeDocument = ({ data, preset, alignment }: { data: ResumeData, preset: string, alignment: 'left' | 'center' | 'right' }) => {
//   const styles = getPdfStyles(preset || 'bold', alignment || 'left');
//   const sections = data.sections || INITIAL_SECTIONS;

//   const renderSectionHeader = (label: string) => (
//     <View style={styles.sectionHeaderRow}>
//       <Text style={styles.sectionTitle}>{label}</Text>
//       <View style={styles.sectionLine} />
//     </View>
//   );

//   const renderSection = (s: SectionOrder) => {
//     const { id, label } = s;
//     switch (id) {
//       case 'summary':
//         return (
//           <View style={styles.section} key={id} wrap={false}>
//             {renderSectionHeader(label)}
//             <Text style={styles.summary}>{data.professionalSummary}</Text>
//           </View>
//         );
//       case 'highlights':
//         return (
//           <View style={styles.section} key={id} wrap={false}>
//             {renderSectionHeader(label)}
//             <View style={styles.metricsRow}>
//               {data.highlights && Object.entries(data.highlights).map(([key, val]) => (
//                 <View key={key} style={styles.metricBox}>
//                   <Text style={styles.metricValue}>{val}</Text>
//                   <Text style={styles.metricLabel}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         );
//       case 'experience':
//         return (
//           <View style={styles.section} key={id}>
//             {renderSectionHeader(label)}
//             {data.experience.map(exp => (
//               <View key={exp.id} style={styles.expItem} wrap={false}>
//                 <View style={styles.expHeader}>
//                   <Text style={styles.expRole}>{exp.role}</Text>
//                   <Text style={styles.expDate}>{exp.startDate} - {exp.endDate}</Text>
//                 </View>
//                 <Text style={styles.expCompany}>{exp.company}</Text>
//                 <Text style={styles.expDesc}>{exp.description}</Text>
//               </View>
//             ))}
//           </View>
//         );
//       case 'testimonials':
//         if (!data.testimonials?.length) return null;
//         return (
//           <View style={styles.section} key={id}>
//             {renderSectionHeader(label)}
//             {data.testimonials.map(test => (
//               <View key={test.id} style={styles.testimonialItem} wrap={false}>
//                 <Text style={styles.testimonialQuote}>"{test.quote}"</Text>
//                 <Text style={styles.testimonialAuthor}>- {test.studentName}, {test.studentTitle}</Text>
//               </View>
//             ))}
//           </View>
//         );
//       case 'skills':
//         return (
//           <View style={styles.section} key={id} wrap={false}>
//             {renderSectionHeader(label)}
//             <View style={styles.skillsContainer}>
//               {data.technicalSkills.map((skill, i) => <Text key={i} style={styles.skillTag}>{skill}</Text>)}
//             </View>
//           </View>
//         );
//       case 'certs':
//         return (
//           <View style={styles.section} key={id}>
//             {renderSectionHeader(label)}
//             {data.certifications.map(cert => (
//               <View key={cert.id} style={styles.certItem} wrap={false}>
//                 {cert.badge && <Image src={cert.badge} style={styles.certBadge} />}
//                 <View style={styles.certContent}>
//                   <Text style={styles.certName}>{cert.name}</Text>
//                   <Text style={styles.certIssuer}>{cert.issuer} | {cert.date}</Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         );
//       case 'courses':
//         if (!data.courses?.length) return null;
//         return (
//           <View style={styles.section} key={id}>
//             {renderSectionHeader(label)}
//             {data.courses.map(course => (
//               <View key={course.id} style={styles.certItem} wrap={false}>
//                 <View style={styles.certContent}>
//                   <Text style={styles.certName}>{course.title}</Text>
//                   <Text style={styles.certIssuer}>{course.platform} | {course.year}</Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         );
//       case 'edu':
//         return (
//           <View style={styles.section} key={id}>
//             {renderSectionHeader(label)}
//             {data.education.map(edu => (
//               <View key={edu.id} style={styles.certItem} wrap={false}>
//                 <View style={styles.certContent}>
//                   <Text style={styles.certName}>{edu.degree}</Text>
//                   <Text style={styles.certIssuer}>{edu.school} | {edu.year}</Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Document title={data.personalInfo.fullName ? `${data.personalInfo.fullName} Resume` : 'Resume'}>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.header}>
//           {data.logo && <View style={styles.logoArea}><Image src={data.logo} style={styles.logo} /></View>}
//           {data.personalInfo && <Text style={styles.name}>{data.personalInfo.fullName}</Text>}
//           {data.personalInfo && <Text style={styles.title}>{data.personalInfo.professionalTitle}</Text>}
//           {data.personalInfo && <View style={styles.contactBar}>
//             <Text style={styles.contactItem}>{data.personalInfo.email}</Text>
//             <Text style={styles.contactItem}>{data.personalInfo.location}</Text>
//             <Text style={styles.contactItem}>{data.personalInfo.mobileNumber}</Text>
//             <Text style={styles.contactItem}>{data.personalInfo.linkedInProfile}</Text>
//           </View>}
//         </View>

//         {sections.filter(s => s.column === 'top').map(s => renderSection(s))}

//         <View style={styles.gridContainer}>
//           <View style={styles.gridColMain}>
//             {sections.filter(s => s.column === 'main').map(s => renderSection(s))}
//           </View>
//           <View style={styles.gridColSide}>
//             {sections.filter(s => s.column === 'side').map(s => renderSection(s))}
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// };

// const DEFAULT_RESUME: ResumeData = {
//   id: '1', 
//   name: 'Quantum Whale Professional Profile', 
//   lastModified: new Date().toLocaleDateString(), 
//   completion: 95,
//   logo: DEFAULT_LOGO_SVG,
//   personalInfo: { fullName: 'Alex Rivera', professionalTitle: 'Senior IT Technical Trainer & Cloud Architect', email: 'alex.rivera@quantumwhale.io', mobileNumber: '+1 (555) 987-6543', location: 'Austin, TX', linkedInProfile: 'linkedin.com/in/alexriveratrainer', portfolioWebsite: 'https://alexrivera.tech' },
//   logoAlignment: 'left', 
//   selectedPreset: 'bold',
//   professionalSummary: 'Accomplished Technical Instructor with 10+ years of experience specialized in Cloud Infrastructure (AWS/Azure), Container Orchestration (Kubernetes), and Modern DevOps practices. Expert in designing comprehensive curriculum, managing virtual training labs, and delivering high-engagement workshops for Fortune 500 engineering teams.',
//   coreExpertise: ['Instructional Design', 'Virtual Labs', 'DevOps Architecture', 'Enterprise Training'],
//   technicalSkills: ['AWS Solutions Architect', 'Kubernetes', 'Terraform', 'Docker', 'Python', 'Linux Systems'],
//   experience: [{ id: 'tx1', company: 'Global Technical Institute', role: 'Lead Technical Instructor', startDate: 'Jan 2021', endDate: 'Present', description: 'Spearheaded AWS training programs, increasing certification pass rates by 35%. Managed 200+ virtual lab environments for enterprise clients including Microsoft and IBM.' }],
//   courses: [{ id: 'c1', title: 'Advanced Cloud Architecture', platform: 'A Cloud Guru', year: '2022' }],
//   certifications: [{ id: 'cert1', name: 'Certified Kubernetes Administrator', issuer: 'CNCF', date: '2021' }],
//   education: [{ id: 'edu1', degree: 'M.S. in Computer Science', school: 'University of Texas', year: '2016' }],
//   testimonials: [{ id: 't1', studentName: 'Sarah Jenkins', studentTitle: 'DevOps Engineer at Meta', quote: 'Alex is an exceptional instructor who bridges the gap between complex theory and practical application effortlessly.' }],
//   highlights: { studentsTrained: '5500', corporateClients: '50', workshopsConducted: '180', averageRating: '4.9', trainingHours: '9500', countriesReached: '15' },
//   sections: INITIAL_SECTIONS
// };

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [currentResumeId, setCurrentResumeId] = useState<string | null>('1');
  // const { resumes, status, updateResume, deleteResume, addResume } = usePersistence([DEFAULT_RESUME]);
  const resumes: any[] = [];
  const status = 'synced';
  const updateResume = (id: string, fields: any) => {};
  const deleteResume = (id: string) => {};
  const addResume = (resume: any) => {};
  
  const [appConfig, setAppConfig] = useState(() => ({
    appName: localStorage.getItem('QW_APP_NAME') || 'Quantum Whale',
    appLogo: localStorage.getItem('QW_APP_LOGO') || DEFAULT_LOGO_SVG,
    appSlogan: localStorage.getItem('QW_APP_SLOGAN') || 'Infinite Learning'
  }));

  useEffect(() => {
    localStorage.setItem('QW_APP_NAME', appConfig.appName);
    localStorage.setItem('QW_APP_LOGO', appConfig.appLogo || '');
    localStorage.setItem('QW_APP_SLOGAN', appConfig.appSlogan || '');
    document.title = `${appConfig.appName} - Resume Builder`;
  }, [appConfig]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPdfCompiling, setIsPdfCompiling] = useState(false);
  const [exportMode, setExportMode] = useState<'print' | 'pdf'>('pdf');

  const currentResume = useMemo(() => resumes.find(r => r.id === currentResumeId) || resumes[0], [resumes, currentResumeId]);

  // const createNewResume = () => {
  //   const id = Math.random().toString(36).substr(2, 9);
  //   const newResume: ResumeData = { ...DEFAULT_RESUME, id, name: 'Untitled Resume', lastModified: new Date().toLocaleDateString() };
  //   addResume(newResume);
  //   setCurrentResumeId(id);
  //   setActiveTab('Build');
  // };

  // const handleSmartGenerate = async () => {
  //   if (!aiPrompt.trim()) return;
  //   setIsGenerating(true);
  //   try {
  //     if (!import.meta.env.VITE_API_KEY) {
  //       throw new Error("API_KEY is not configured.");
  //     }
  //     const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
  //     const response = await ai.models.generateContent({
  //       model: 'gemini-3-pro-preview',
  //       contents: `Create a professional IT Trainer resume in JSON format for the profile: ${aiPrompt}. Include branding principles: ${appConfig.appSlogan || ''}, high outcome metrics, and clarity.`,
  //       config: {
  //         responseMimeType: 'application/json',
  //         responseSchema: {
  //           type: Type.OBJECT,
  //           properties: {
  //             name: { type: Type.STRING },
  //             personalInfo: {
  //               type: Type.OBJECT,
  //               properties: {
  //                   fullName: { type: Type.STRING },
  //                   professionalTitle: { type: Type.STRING },
  //                   email: { type: Type.STRING },
  //                   mobileNumber: { type: Type.STRING },
  //                   location: { type: Type.STRING },
  //               },
  //               required: ['fullName', 'professionalTitle']
  //             },
  //             professionalSummary: { type: Type.STRING },
  //             coreExpertise: { type: Type.ARRAY, items: { type: Type.STRING } },
  //             technicalSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
  //             experience: {
  //               type: Type.ARRAY,
  //               items: {
  //                 type: Type.OBJECT,
  //                 properties: {
  //                   id: { type: Type.STRING },
  //                   company: { type: Type.STRING },
  //                   role: { type: Type.STRING },
  //                   startDate: { type: Type.STRING },
  //                   endDate: { type: Type.STRING },
  //                   description: { type: Type.STRING },
  //                 }
  //               }
  //             },
  //             highlights: {
  //               type: Type.OBJECT,
  //               properties: {
  //                   studentsTrained: { type: Type.STRING },
  //                   corporateClients: { type: Type.STRING },
  //                   workshopsConducted: { type: Type.STRING },
  //                   averageRating: { type: Type.STRING },
  //                   trainingHours: { type: Type.STRING },
  //                   countriesReached: { type: Type.STRING },
  //               }
  //             }
  //           }
  //         }
  //       }
  //     });

  //     const generated = JSON.parse(response.text);
  //     const newResume: ResumeData = {
  //       ...DEFAULT_RESUME,
  //       ...generated,
  //       id: Math.random().toString(36).substr(2, 9),
  //       lastModified: new Date().toLocaleDateString(),
  //       completion: 100
  //     };
      
  //     addResume(newResume);
  //     setCurrentResumeId(newResume.id);
  //     setShowAiModal(false);
  //     setAiPrompt('');
  //     setActiveTab('Build');
  //   } catch (err) {
  //     console.error("AI Generation Error:", err);
  //     alert("AI failed to generate resume.");
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  // const handleParseUpload = async (file: File) => {
  //   setIsParsing(true);
  //   try {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = async () => {
  //       const base64 = (reader.result as string).split(',')[1];
  //       if (!import.meta.env.VITE_API_KEY) {
  //         throw new Error("API_KEY is not configured.");
  //       }
  //       const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
  //       const response = await ai.models.generateContent({
  //         model: 'gemini-3-pro-preview',
  //         contents: {
  //           parts: [
  //             { text: `Extract details into ${appConfig.appName} IT Trainer format (JSON).` },
  //             { inlineData: { mimeType: file.type, data: base64 } }
  //           ]
  //         },
  //         config: {
  //           responseMimeType: 'application/json'
  //         }
  //       });
        
  //       const parsed = JSON.parse(response.text);
  //       const newResume: ResumeData = {
  //         ...DEFAULT__RESUME,
  //         ...parsed,
  //         id: Math.random().toString(36).substr(2, 9),
  //         name: `Parsed Profile - ${new Date().toLocaleDateString()}`,
  //         lastModified: new Date().toLocaleDateString(),
  //         completion: 90
  //       };
  //       addResume(newResume);
  //       setCurrentResumeId(newResume.id);
  //       setActiveTab('Build');
  //       setIsParsing(false);
  //     };
  //   } catch (err) {
  //     console.error("Parsing Error:", err);
  //     alert("Failed to parse image.");
  //     setIsParsing(false);
  //   }
  // };

  const startExportSequence = (mode: 'print' | 'pdf' = 'pdf') => {
    setExportMode(mode);
    setShowConfirm(true);
  };

  const confirmExport = () => {
    setShowConfirm(false);
    if (exportMode === 'print') {
      window.print();
    } else {
      setIsExporting(true);
    }
  };

  const generateAndDownload = async () => {
    setIsPdfCompiling(true);
    try {
      if (!currentResume || !currentResume.personalInfo) {
        throw new Error("Resume data is incomplete.");
      }
      // const doc = <ResumeDocument 
      //   data={currentResume} 
      //   preset={currentResume.selectedPreset || 'bold'} 
      //   alignment={currentResume.logoAlignment || 'left'} 
      // />;
      // const blob = await pdf(doc).toBlob();
      // const url = URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `${currentResume.personalInfo.fullName.replace(/\s+/g, '_')}_${appConfig.appName.replace(/\s+/g, '_')}_Profile.pdf`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // URL.revokeObjectURL(url);
      // setTimeout(() => { setIsExporting(false); setIsPdfCompiling(false); }, 800);
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      window.print();
      setIsPdfCompiling(false);
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* AI PARSING LOADER OVERLAY */}
      {isParsing && (
        <div className="fixed inset-0 z-[30000] bg-slate-900/60 backdrop-blur-xl flex flex-col items-center justify-center text-white p-10 text-center animate-in fade-in duration-500">
           <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl animate-pulse">
              <BrainCircuit className="w-16 h-16 text-white" />
           </div>
           <h2 className="text-4xl font-black tracking-tight mb-4 uppercase">Quantum Vision Sync</h2>
           <p className="text-blue-200 text-xl font-medium max-w-lg leading-relaxed">Analyzing learning history from your document...</p>
           <div className="mt-12 flex gap-2">
             <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
             <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
             <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
           </div>
        </div>
      )}

      {/* AI GENERATION MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-[25000] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-100 animate-in zoom-in-95 duration-300">
             <div className="flex justify-between items-start mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Smart Generate</h2>
                    <p className="text-slate-500 font-medium">Build a complete profile from scratch.</p>
                  </div>
               </div>
               <button onClick={() => setShowAiModal(false)} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
             </div>

             <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Describe your profile</label>
                  <textarea 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Lead Instructor specialized in AI systems and technical education..."
                    className="w-full h-48 bg-slate-50 border border-slate-200 rounded-3xl p-6 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg resize-none"
                  />
                </div>
                
                <button 
                  onClick={handleSmartGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-blue-600 disabled:opacity-50 transition-all shadow-xl shadow-slate-900/10"
                >
                  {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Logic...</> : <><Wand2 className="w-5 h-5" /> Generate Profile</>}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* GLOBAL BACKEND STATUS HEADER */}
      <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest no-print">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <Waves className="w-3.5 h-3.5 text-blue-400" />
              <span>Project: {appConfig.appName} Hub</span>
           </div>
           <div className="h-3 w-[1px] bg-slate-700" />
           <div className="flex items-center gap-2">
              <span className="text-slate-500">Node Status:</span>
              <span className="text-emerald-400">Deep Blue</span>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <div className={`flex items-center gap-2 transition-all ${
             status === 'syncing' ? 'text-blue-400' : status === 'synced' ? 'text-emerald-400' : 'text-slate-400'
           }`}>
             {status === 'fetching' || status === 'syncing' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Cloud className="w-3.5 h-3.5" />}
             <span>{status === 'fetching' ? 'Fetching...' : status === 'syncing' ? 'Syncing...' : 'System Synced'}</span>
           </div>
        </div>
      </div>

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('Dashboard')}>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                  <img src={appConfig.appLogo || ''} alt="App Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">{appConfig.appName}</span>
                  <span className="text-[8px] font-bold text-blue-500 uppercase tracking-[0.3em]">{appConfig.appSlogan || ''}</span>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-1">
                {[
                  { id: 'Dashboard', icon: LayoutDashboard },
                  { id: 'Build', icon: PenTool },
                  { id: 'Preview', icon: Eye },
                  { id: 'Admin', icon: ShieldCheck },
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as AppTab)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}><tab.icon className="w-4 h-4" />{tab.id}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={createNewResume} className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"><Plus className="w-4 h-4" /> New Profile</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {status === 'fetching' ? (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-in fade-in">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Querying Global Nodes...</p>
            </div>
        ) : (
            <>
                {/* {activeTab === 'Dashboard' && (
                  <Dashboard 
                    resumes={resumes} 
                    onEdit={(id) => { setCurrentResumeId(id); setActiveTab('Build'); }} 
                    onPreview={(id) => { setCurrentResumeId(id); setActiveTab('Preview'); }} 
                    onNew={createNewResume}
                    onGenerateAI={() => setShowAiModal(true)}
                    onUpload={handleParseUpload}
                    onImportJson={addResume}
                    appConfig={appConfig}
                  />
                )}
                {activeTab === 'Build' && currentResume && (
                  <Editor 
                    data={currentResume} 
                    onChange={(fields) => currentResumeId && updateResume(currentResumeId, fields)} 
                    onPreview={() => setActiveTab('Preview')}
                    onGeneratePDF={startExportSequence}
                  />
                )}
                {activeTab === 'Preview' && currentResume && (
                  <Preview 
                    data={currentResume} 
                    onGeneratePDF={startExportSequence}
                    onUpdate={(fields) => currentResumeId && updateResume(currentResumeId, fields)}
                    selectedPreset={currentResume.selectedPreset || 'bold'}
                    onPresetChange={(p) => currentResumeId && updateResume(currentResumeId, { selectedPreset: p })}
                  />
                )}
                {activeTab === 'Admin' && (
                  <Admin 
                    resumes={resumes}
                    onDelete={deleteResume}
                    onView={(id) => { setCurrentResumeId(id); setActiveTab('Preview'); }}
                    appConfig={appConfig}
                    setAppConfig={setAppConfig}
                  />
                )} */}
            </>
        )}
      </main>

      {/* FOOTER PDF MODALS */}
      {showConfirm && (
        <div className="fixed inset-0 z-[20000] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-fade-in border border-slate-100">
             <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Confirm Export</h2>
             <p className="text-slate-500 mb-8 text-sm font-medium">Your resume will be rendered using the **{currentResume?.selectedPreset || 'bold'}** preset. Proceed with generation?</p>
             <div className="flex gap-4">
                <button onClick={() => setShowConfirm(false)} className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-700 rounded-2xl font-bold">Cancel</button>
                <button onClick={confirmExport} className="flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-bold">Continue</button>
             </div>
          </div>
        </div>
      )}

      {isExporting && (
        <div className="fixed inset-0 z-[10000] bg-white/95 backdrop-blur-lg flex flex-col items-center justify-center no-print animate-fade-in">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Ready for Local Save</h2>
            <button onClick={generateAndDownload} disabled={isPdfCompiling} className="flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl">
                {isPdfCompiling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                Download Profile
            </button>
            <button onClick={() => setIsExporting(false)} className="mt-8 text-xs font-black text-slate-400 uppercase tracking-widest">Return to App</button>
        </div>
      )}
    </div>
  );
};

export default App;