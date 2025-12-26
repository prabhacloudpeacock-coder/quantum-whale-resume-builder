
export interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  mobileNumber: string;
  location: string;
  linkedInProfile: string;
  portfolioWebsite: string;
}

export interface TrainingExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  platform: string;
  year: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  badge?: string; // Base64 encoded digital badge image
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface Testimonial {
  id: string;
  studentName: string;
  studentTitle: string;
  quote: string;
}

export interface TrainingMetrics {
  studentsTrained: string;
  corporateClients: string;
  workshopsConducted: string;
  averageRating: string;
  trainingHours: string;
  countriesReached: string;
}

export interface SectionOrder {
  id: string;
  label: string;
  icon: string;
  column: 'top' | 'main' | 'side';
}

export const INITIAL_SECTIONS: SectionOrder[] = [
  { id: 'summary', label: 'Executive Summary', icon: 'FileText', column: 'top' },
  { id: 'highlights', label: 'Impact Benchmarks', icon: 'BarChart3', column: 'top' },
  { id: 'experience', label: 'Professional Experience', icon: 'Briefcase', column: 'main' },
  { id: 'certs', label: 'Certifications', icon: 'Award', column: 'main' },
  { id: 'testimonials', label: 'Stakeholder Endorsements', icon: 'MessageSquareQuote', column: 'main' },
  { id: 'skills', label: 'Technical Stack', icon: 'Zap', column: 'side' },
  { id: 'courses', label: 'Professional Development', icon: 'BookOpen', column: 'side' },
  { id: 'edu', label: 'Education', icon: 'GraduationCap', column: 'side' },
];

export interface ResumeData {
  id: string;
  name: string;
  lastModified: string;
  completion: number;
  logo?: string; // Base64 encoded logo string
  logoAlignment?: 'left' | 'center' | 'right';
  selectedPreset?: string; // Persist the visual theme
  personalInfo: PersonalInfo;
  professionalSummary: string;
  coreExpertise: string[];
  technicalSkills: string[];
  experience: TrainingExperience[];
  courses: Course[];
  certifications: Certification[];
  education: Education[];
  testimonials: Testimonial[];
  highlights: TrainingMetrics;
  sections?: SectionOrder[]; // Persist rearrange order
  user_id?: string; // For database ownership
}

export interface AppConfig {
  appName: string;
  appLogo: string;
  appSlogan: string;
}

export type AppTab = 'Dashboard' | 'Build' | 'Preview' | 'Admin';

export interface FormattingOptions {
  fontSize: 'Small' | 'Medium' | 'Large';
  fontFamily: 'Inter' | 'Roboto' | 'Serif';
  lineSpacing: 'Compact' | 'Normal' | 'Loose';
  sectionSpacing: 'Compact' | 'Medium' | 'Wide';
}
