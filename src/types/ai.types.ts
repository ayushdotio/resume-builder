export interface generateSummary {
  experienceLevel: string;
  skills: string[];
  jobTitle: string;
}

export interface generateSkills {
  experienceLevel: string;
  jobTitle: string;
}

export interface generateProjectDescription {
  projectTitle?: string;
  mvp: string;
  techStack: string[];
  experienceLevel: string;
  jobTitle: string;
}

export interface generateExperienceDescription {
  role: string;
  companyName: string;
  workDuration: string;
  techStack: string[];
  experienceLevel: string;
}
