import { defaultSiteData } from "./defaultData";
import type {
  BlogPost,
  ContactMessage,
  Profile,
  Project,
  SiteData,
  Skill,
  SkillCategory,
} from "./types";
import { SKILL_CATEGORIES } from "./types";

export const SITE_DATA_KEY = "portfolio.site-data.v1";
export const SITE_DATA_EVENT = "portfolio:data-updated";

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function cloneSiteData(data: SiteData): SiteData {
  return JSON.parse(JSON.stringify(data)) as SiteData;
}

export function createId(prefix: string): string {
  const randomPart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${randomPart}`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, value));
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }
  return value.filter((item): item is string => typeof item === "string");
}

function asCategory(value: unknown, fallback: SkillCategory): SkillCategory {
  return SKILL_CATEGORIES.includes(value as SkillCategory)
    ? (value as SkillCategory)
    : fallback;
}

function normalizeProfile(value: unknown): Profile {
  const source = asRecord(value) ?? {};
  const base = defaultSiteData.profile;
  return {
    name: asString(source.name, base.name),
    role: asString(source.role, base.role),
    tagline: asString(source.tagline, base.tagline),
    bio: asString(source.bio, base.bio),
    avatar: asString(source.avatar, base.avatar),
    location: asString(source.location, base.location),
    email: asString(source.email, base.email),
    github: asString(source.github, base.github),
    linkedin: asString(source.linkedin, base.linkedin),
    resumeUrl: asString(source.resumeUrl, base.resumeUrl),
    availability: asString(source.availability, base.availability),
    yearsOfExperience: asNumber(
      source.yearsOfExperience,
      base.yearsOfExperience,
      0,
      60,
    ),
    projectsShipped: asNumber(source.projectsShipped, base.projectsShipped, 0, 999),
  };
}

function normalizeSkill(value: unknown): Skill | null {
  const source = asRecord(value);
  if (!source) return null;
  return {
    id: asString(source.id, createId("skill")),
    name: asString(source.name, "未命名技能"),
    category: asCategory(source.category, "前端"),
    level: asNumber(source.level, 60, 0, 100),
    note: asString(source.note, ""),
  };
}

function normalizeProject(value: unknown): Project | null {
  const source = asRecord(value);
  if (!source) return null;
  return {
    id: asString(source.id, createId("project")),
    title: asString(source.title, "未命名项目"),
    description: asString(source.description, ""),
    cover: asString(source.cover, defaultSiteData.projects[0].cover),
    link: asString(source.link, "#"),
    tags: asStringArray(source.tags, []),
    year: asString(source.year, ""),
    featured: asBoolean(source.featured, false),
  };
}

function normalizePost(value: unknown): BlogPost | null {
  const source = asRecord(value);
  if (!source) return null;
  const title = asString(source.title, "未命名文章");
  return {
    id: asString(source.id, createId("post")),
    slug: asString(source.slug, title.toLowerCase().replace(/\s+/g, "-")),
    title,
    excerpt: asString(source.excerpt, ""),
    content: asString(source.content, ""),
    cover: asString(source.cover, defaultSiteData.posts[0].cover),
    tags: asStringArray(source.tags, []),
    publishedAt: asString(source.publishedAt, new Date().toISOString().slice(0, 10)),
    published: asBoolean(source.published, true),
  };
}

function normalizeMessage(value: unknown): ContactMessage | null {
  const source = asRecord(value);
  if (!source) return null;
  return {
    id: asString(source.id, createId("message")),
    name: asString(source.name, "匿名访客"),
    email: asString(source.email, ""),
    message: asString(source.message, ""),
    createdAt: asString(source.createdAt, new Date().toISOString()),
    read: asBoolean(source.read, false),
  };
}

function normalizeList<T>(
  value: unknown,
  normalize: (item: unknown) => T | null,
): T[] | null {
  if (!Array.isArray(value)) return null;
  return value
    .map((item) => normalize(item))
    .filter((item): item is T => item !== null);
}

export function normalizeSiteData(value: unknown): SiteData {
  const source = asRecord(value);
  if (!source) {
    return cloneSiteData(defaultSiteData);
  }
  return {
    profile: normalizeProfile(source.profile),
    skills: normalizeList(source.skills, normalizeSkill) ?? [],
    projects: normalizeList(source.projects, normalizeProject) ?? [],
    posts: normalizeList(source.posts, normalizePost) ?? [],
    messages: normalizeList(source.messages, normalizeMessage) ?? [],
  };
}

export function readSiteData(): SiteData {
  if (!isBrowser()) {
    return cloneSiteData(defaultSiteData);
  }
  try {
    const raw = window.localStorage.getItem(SITE_DATA_KEY);
    if (!raw) {
      return cloneSiteData(defaultSiteData);
    }
    return normalizeSiteData(JSON.parse(raw) as unknown);
  } catch {
    return cloneSiteData(defaultSiteData);
  }
}

export function saveSiteData(data: SiteData): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(SITE_DATA_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(SITE_DATA_EVENT));
  } catch {
    // 隐私模式下 localStorage 可能不可写，此时仅保留内存状态。
  }
}

export function subscribeSiteData(listener: () => void): () => void {
  if (!isBrowser()) {
    return () => undefined;
  }
  const handleStorage = (event: StorageEvent): void => {
    if (event.key === SITE_DATA_KEY) {
      listener();
    }
  };
  window.addEventListener(SITE_DATA_EVENT, listener);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(SITE_DATA_EVENT, listener);
    window.removeEventListener("storage", handleStorage);
  };
}

