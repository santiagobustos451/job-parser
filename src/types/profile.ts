type Profile = {
  identity: Identity;
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  languages: Language[];
};

type Identity = {
  name: string;
  location: string;
  headline: string;
  email: string;
  phone: string;
  linkedin?: string;
};

type Experience = {
  type: ExperienceType;
  organization: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string[];
};

type ExperienceType =
  'employment' | 'freelance' | 'project' | 'teaching' | 'internship' | 'other';

type Education = {
  institution: string;
  title: string;
  status: 'completed' | 'paused' | 'in_progress';
  startDate: string;
  endDate: string | null;
};

type SkillGroup = {
  category: string;
  items: string[];
};

type Language = {
  language: string;
  level: string;
};

export default Profile;
