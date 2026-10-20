"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { defaultSiteData } from "@/lib/defaultData";
import {
  cloneSiteData,
  createId,
  readSiteData,
  saveSiteData,
  subscribeSiteData,
} from "@/lib/storage";
import type {
  BlogPost,
  ContactMessage,
  Profile,
  Project,
  SiteData,
  Skill,
} from "@/lib/types";

interface NewMessageInput {
  name: string;
  email: string;
  message: string;
}

interface SiteDataContextValue {
  data: SiteData;
  isReady: boolean;
  updateProfile: (profile: Profile) => void;
  saveSkill: (skill: Skill) => void;
  deleteSkill: (id: string) => void;
  saveProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  savePost: (post: BlogPost) => void;
  deletePost: (id: string) => void;
  addMessage: (input: NewMessageInput) => void;
  toggleMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  resetData: () => void;
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(() => cloneSiteData(defaultSiteData));
  const [isReady, setIsReady] = useState(false);
  const dataRef = useRef<SiteData>(data);

  const commit = useCallback((updater: (current: SiteData) => SiteData): void => {
    const next = updater(dataRef.current);
    dataRef.current = next;
    setData(next);
    saveSiteData(next);
  }, []);

  useEffect(() => {
    const sync = (): void => {
      const next = readSiteData();
      dataRef.current = next;
      setData(next);
    };
    sync();
    setIsReady(true);
    return subscribeSiteData(sync);
  }, []);

  const updateProfile = useCallback(
    (profile: Profile): void => {
      commit((current) => ({ ...current, profile }));
    },
    [commit],
  );

  const saveSkill = useCallback(
    (skill: Skill): void => {
      commit((current) => {
        const exists = current.skills.some((item) => item.id === skill.id);
        return {
          ...current,
          skills: exists
            ? current.skills.map((item) => (item.id === skill.id ? skill : item))
            : [...current.skills, skill],
        };
      });
    },
    [commit],
  );

  const deleteSkill = useCallback(
    (id: string): void => {
      commit((current) => ({
        ...current,
        skills: current.skills.filter((item) => item.id !== id),
      }));
    },
    [commit],
  );

  const saveProject = useCallback(
    (project: Project): void => {
      commit((current) => {
        const exists = current.projects.some((item) => item.id === project.id);
        return {
          ...current,
          projects: exists
            ? current.projects.map((item) => (item.id === project.id ? project : item))
            : [project, ...current.projects],
        };
      });
    },
    [commit],
  );

  const deleteProject = useCallback(
    (id: string): void => {
      commit((current) => ({
        ...current,
        projects: current.projects.filter((item) => item.id !== id),
      }));
    },
    [commit],
  );

  const savePost = useCallback(
    (post: BlogPost): void => {
      commit((current) => {
        const exists = current.posts.some((item) => item.id === post.id);
        return {
          ...current,
          posts: exists
            ? current.posts.map((item) => (item.id === post.id ? post : item))
            : [post, ...current.posts],
        };
      });
    },
    [commit],
  );

  const deletePost = useCallback(
    (id: string): void => {
      commit((current) => ({
        ...current,
        posts: current.posts.filter((item) => item.id !== id),
      }));
    },
    [commit],
  );

  const addMessage = useCallback(
    (input: NewMessageInput): void => {
      const message: ContactMessage = {
        id: createId("message"),
        name: input.name.trim(),
        email: input.email.trim(),
        message: input.message.trim(),
        createdAt: new Date().toISOString(),
        read: false,
      };
      commit((current) => ({
        ...current,
        messages: [message, ...current.messages],
      }));
    },
    [commit],
  );

  const toggleMessageRead = useCallback(
    (id: string): void => {
      commit((current) => ({
        ...current,
        messages: current.messages.map((item) =>
          item.id === id ? { ...item, read: !item.read } : item,
        ),
      }));
    },
    [commit],
  );

  const deleteMessage = useCallback(
    (id: string): void => {
      commit((current) => ({
        ...current,
        messages: current.messages.filter((item) => item.id !== id),
      }));
    },
    [commit],
  );

  const resetData = useCallback((): void => {
    commit(() => cloneSiteData(defaultSiteData));
  }, [commit]);

  const value = useMemo<SiteDataContextValue>(
    () => ({
      data,
      isReady,
      updateProfile,
      saveSkill,
      deleteSkill,
      saveProject,
      deleteProject,
      savePost,
      deletePost,
      addMessage,
      toggleMessageRead,
      deleteMessage,
      resetData,
    }),
    [
      data,
      isReady,
      updateProfile,
      saveSkill,
      deleteSkill,
      saveProject,
      deleteProject,
      savePost,
      deletePost,
      addMessage,
      toggleMessageRead,
      deleteMessage,
      resetData,
    ],
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteDataContextValue {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error("useSiteData 必须在 SiteDataProvider 内使用");
  }
  return context;
}
