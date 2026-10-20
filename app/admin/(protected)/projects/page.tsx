"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useSiteData } from "@/components/SiteDataProvider";
import { coverStyle } from "@/lib/cover";
import { createId } from "@/lib/storage";
import type { Project } from "@/lib/types";
import { isValidUrl } from "@/lib/utils";

const DEFAULT_COVER =
  "linear-gradient(135deg, #101a33 0%, #1e1b4b 48%, #0b0f1a 100%)";

interface ProjectDraft {
  id: string | null;
  title: string;
  description: string;
  cover: string;
  link: string;
  tags: string;
  year: string;
  featured: boolean;
}

interface ProjectErrors {
  title?: string;
  description?: string;
  cover?: string;
  link?: string;
  tags?: string;
  year?: string;
}

const EMPTY_DRAFT: ProjectDraft = {
  id: null,
  title: "",
  description: "",
  cover: DEFAULT_COVER,
  link: "",
  tags: "",
  year: String(new Date().getFullYear()),
  featured: false,
};

function parseTags(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(/[,，]/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    ),
  );
}

function validateProject(draft: ProjectDraft): ProjectErrors {
  const errors: ProjectErrors = {};
  const title = draft.title.trim();
  const description = draft.description.trim();
  if (title.length < 2) errors.title = "项目名称至少 2 个字符";
  else if (title.length > 60) errors.title = "项目名称不超过 60 个字符";
  if (description.length < 10) errors.description = "项目描述至少 10 个字符";
  else if (description.length > 300) errors.description = "项目描述不超过 300 个字符";
  if (draft.cover.trim().length > 500) errors.cover = "封面内容过长";
  if (!isValidUrl(draft.link)) errors.link = "链接格式不正确（可用 https://、/ 或 #）";
  if (!/^\d{4}$/.test(draft.year.trim())) errors.year = "年份需为 4 位数字，如 2025";
  const tags = parseTags(draft.tags);
  if (tags.length > 8) errors.tags = "最多 8 个标签";
  else if (tags.some((tag) => tag.length > 20)) errors.tags = "单个标签不超过 20 个字符";
  return errors;
}

export default function AdminProjectsPage() {
  const { data, saveProject, deleteProject } = useSiteData();
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  const [errors, setErrors] = useState<ProjectErrors>({});

  const startCreate = (): void => {
    setDraft({ ...EMPTY_DRAFT });
    setErrors({});
  };

  const startEdit = (project: Project): void => {
    setDraft({
      id: project.id,
      title: project.title,
      description: project.description,
      cover: project.cover,
      link: project.link,
      tags: project.tags.join(", "),
      year: project.year,
      featured: project.featured,
    });
    setErrors({});
  };

  const closeEditor = (): void => {
    setDraft(null);
    setErrors({});
  };

  const patchDraft = <K extends keyof ProjectDraft>(
    key: K,
    value: ProjectDraft[K],
  ): void => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    if (key === "title" || key === "description" || key === "cover" || key === "link" || key === "tags" || key === "year") {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!draft) return;
    const nextErrors = validateProject(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    saveProject({
      id: draft.id ?? createId("project"),
      title: draft.title.trim(),
      description: draft.description.trim(),
      cover: draft.cover.trim(),
      link: draft.link.trim() || "#",
      tags: parseTags(draft.tags),
      year: draft.year.trim(),
      featured: draft.featured,
    });
    closeEditor();
  };

  const handleDelete = (project: Project): void => {
    const confirmed = window.confirm(`确定删除项目「${project.title}」吗？`);
    if (confirmed) {
      deleteProject(project.id);
      if (draft?.id === project.id) closeEditor();
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        label="项目 / projects"
        title="作品管理"
        description="维护首页展示的项目。精选项目会排在前面，并带有「精选」标记。"
        action={
          <button type="button" onClick={startCreate} className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            新增项目
          </button>
        }
      />

      {draft ? (
        <form onSubmit={handleSubmit} noValidate className="panel p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label-mono">
                {draft.id ? "编辑项目 / edit" : "新增项目 / new"}
              </p>
              <h2 className="mt-2 font-serif text-xl text-star">
                {draft.id ? "修改项目信息" : "记录一个新项目"}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeEditor}
              aria-label="关闭编辑器"
              className="grid h-8 w-8 place-items-center border border-white/10 text-star-dim transition-colors hover:border-white/30 hover:text-star"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="project-title" className="field-label">
                项目名称
              </label>
              <input
                id="project-title"
                type="text"
                value={draft.title}
                onChange={(event) => patchDraft("title", event.target.value)}
                className="field"
                placeholder="例如 Orbit 观测台"
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.title}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="project-year" className="field-label">
                年份
              </label>
              <input
                id="project-year"
                type="text"
                inputMode="numeric"
                value={draft.year}
                onChange={(event) => patchDraft("year", event.target.value)}
                className="field"
                placeholder="2025"
                aria-invalid={Boolean(errors.year)}
              />
              {errors.year ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.year}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="project-tags" className="field-label">
                标签
              </label>
              <input
                id="project-tags"
                type="text"
                value={draft.tags}
                onChange={(event) => patchDraft("tags", event.target.value)}
                className="field"
                placeholder="Next.js, Canvas, PostgreSQL"
                aria-invalid={Boolean(errors.tags)}
              />
              {errors.tags ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.tags}</p>
              ) : (
                <p className="mt-1.5 text-xs text-star-faint">用逗号分隔，最多 8 个。</p>
              )}
            </div>
            <div>
              <label htmlFor="project-link" className="field-label">
                项目链接
              </label>
              <input
                id="project-link"
                type="text"
                value={draft.link}
                onChange={(event) => patchDraft("link", event.target.value)}
                className="field"
                placeholder="https://example.com 或 #"
                aria-invalid={Boolean(errors.link)}
              />
              {errors.link ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.link}</p>
              ) : null}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="project-description" className="field-label">
                项目描述
              </label>
              <textarea
                id="project-description"
                rows={4}
                value={draft.description}
                onChange={(event) => patchDraft("description", event.target.value)}
                className="field resize-y"
                placeholder="说明问题、方案与结果，建议 60 - 160 字。"
                aria-invalid={Boolean(errors.description)}
              />
              {errors.description ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.description}</p>
              ) : (
                <p className="mt-1.5 text-xs text-star-faint">
                  当前 {draft.description.trim().length} 个字符，最多 300 字。
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="project-cover" className="field-label">
                封面
              </label>
              <textarea
                id="project-cover"
                rows={2}
                value={draft.cover}
                onChange={(event) => patchDraft("cover", event.target.value)}
                className="field resize-y font-mono text-xs"
                placeholder="图片 URL，或 CSS 渐变（linear-gradient(...)）"
                aria-invalid={Boolean(errors.cover)}
              />
              {errors.cover ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.cover}</p>
              ) : (
                <p className="mt-1.5 text-xs text-star-faint">
                  留空则使用默认渐变；支持图片地址或 CSS gradient。
                </p>
              )}
              <div
                className="relative mt-3 h-28 overflow-hidden border border-white/[0.08]"
                style={coverStyle(draft.cover)}
              >
                <div
                  className="absolute inset-0 bg-grid-faint opacity-50 [background-size:26px_26px]"
                  aria-hidden="true"
                />
                <span className="absolute bottom-3 left-4 font-serif text-base text-white/90">
                  {draft.title || "项目名称"}
                </span>
                <span className="absolute right-4 top-3 font-mono text-[10px] tracking-widest text-white/60">
                  {draft.year || "年份"}
                </span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-star-dim">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(event) => patchDraft("featured", event.target.checked)}
                  className="h-4 w-4 accent-[#8fa8ff]"
                />
                标记为精选项目
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" aria-hidden="true" />
              {draft.id ? "保存修改" : "添加项目"}
            </button>
            <button type="button" onClick={closeEditor} className="btn-ghost">
              取消
            </button>
          </div>
        </form>
      ) : null}

      <section aria-label="项目列表">
        <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-2">
          <h2 className="font-serif text-lg text-star">
            全部项目
            <span className="ml-2 font-mono text-[9px] uppercase tracking-widest text-star-faint">
              {data.projects.length} total
            </span>
          </h2>
          <span className="font-mono text-[10px] text-star-faint">
            精选 {data.projects.filter((project) => project.featured).length} 个
          </span>
        </div>

        {data.projects.length === 0 ? (
          <div className="mt-4 border border-dashed border-white/10 p-8 text-center">
            <p className="text-sm text-star-dim">还没有项目记录。</p>
            <p className="mt-1 text-xs text-star-faint">
              点击「新增项目」，让作品出现在首页。
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {[...data.projects]
              .sort((a, b) => Number(b.featured) - Number(a.featured))
              .map((project) => (
                <li
                  key={project.id}
                  className="panel panel-hover flex flex-col gap-4 p-3 sm:flex-row sm:items-center"
                >
                  <div
                    className="relative h-16 w-full shrink-0 overflow-hidden border border-white/[0.08] sm:w-28"
                    style={coverStyle(project.cover)}
                  >
                    <div
                      className="absolute inset-0 bg-grid-faint opacity-40 [background-size:22px_22px]"
                      aria-hidden="true"
                    />
                    {project.featured ? (
                      <span className="absolute bottom-1.5 left-1.5 bg-space/60 px-1.5 py-0.5 font-mono text-[8px] tracking-widest text-star backdrop-blur-sm">
                        精选
                      </span>
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm text-star">{project.title}</p>
                      <span className="font-mono text-[9px] tracking-wide text-star-faint">
                        {project.year}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-star-dim">
                      {project.description}
                    </p>
                    {project.tags.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={`${project.id}-${tag}`}
                            className="border border-white/10 px-1.5 py-0.5 font-mono text-[9px] text-star-faint"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {project.link && project.link !== "#" ? (
                      <a
                        href={project.link}
                        target={project.link.startsWith("http") ? "_blank" : undefined}
                        rel={project.link.startsWith("http") ? "noreferrer" : undefined}
                        aria-label={`打开 ${project.title}`}
                        className="grid h-8 w-8 place-items-center border border-white/10 text-star-dim transition-colors hover:border-accent/50 hover:text-star"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => startEdit(project)}
                      aria-label={`编辑 ${project.title}`}
                      className="grid h-8 w-8 place-items-center border border-white/10 text-star-dim transition-colors hover:border-accent/50 hover:text-star"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project)}
                      aria-label={`删除 ${project.title}`}
                      className="grid h-8 w-8 place-items-center border border-white/10 text-star-dim transition-colors hover:border-rose-400/50 hover:text-rose-200"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
}
