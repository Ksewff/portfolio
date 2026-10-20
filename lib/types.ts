export interface Profile {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  avatar: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  availability: string;
  yearsOfExperience: number;
  projectsShipped: number;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  note: string;
}

export type SkillCategory = "前端" | "后端" | "设计" | "工具";

export const SKILL_CATEGORIES: SkillCategory[] = ["前端", "后端", "设计", "工具"];

export interface Project {
  id: string;
  title: string;
  description: string;
  cover: string;
  link: string;
  tags: string[];
  year: string;
  featured: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  tags: string[];
  publishedAt: string;
  published: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SiteData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  posts: BlogPost[];
  messages: ContactMessage[];
}

export interface AdminToken {
  username: string;
  token: string;
  issuedAt: number;
  expiresAt: number;
}
