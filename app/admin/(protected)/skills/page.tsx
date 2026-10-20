"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useSiteData } from "@/components/SiteDataProvider";
import { createId } from "@/lib/storage";
import { SKILL_CATEGORIES, type Skill, type SkillCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SkillDraft {
  id: string | null;
  name: string;
  category: SkillCategory;
  level: number;
  note: string;
}

interface SkillErrors {
  name?: string;
  level?: string;
  note?: string;
}

const EMPTY_DRAFT: SkillDraft = {
  id: null,
  name: "",
  category: "前端",
  level: 70,
  note: "",
};

function validateSkill(draft: SkillDraft): SkillErrors {
  const errors: SkillErrors = {};
  const name = draft.name.trim();
  if (name.length === 0) errors.name = "请填写技能名称";
  else if (name.length > 24) errors.name = "技能名称不超过 24 个字符";
  if (!Number.isFinite(draft.level) || draft.level < 0 || draft.level > 100) {
    errors.level = "熟练度需要在 0 - 100 之间";
  }
  if (draft.note.trim().length > 60) errors.note = "备注不超过 60 个字符";
  return errors;
}

export default function AdminSkillsPage() {
  const { data, saveSkill, deleteSkill } = useSiteData();
  const [draft, setDraft] = useState<SkillDraft | null>(null);
  const [errors, setErrors] = useState<SkillErrors>({});

  const startCreate = (): void => {
    setDraft({ ...EMPTY_DRAFT });
    setErrors({});
  };

  const startEdit = (skill: Skill): void => {
    setDraft({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      level: skill.level,
      note: skill.note,
    });
    setErrors({});
  };

  const closeEditor = (): void => {
    setDraft(null);
    setErrors({});
  };

  const patchDraft = <K extends keyof SkillDraft>(key: K, value: SkillDraft[K]): void => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!draft) return;
    const nextErrors = validateSkill(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    saveSkill({
      id: draft.id ?? createId("skill"),
      name: draft.name.trim(),
      category: draft.category,
      level: Math.round(draft.level),
      note: draft.note.trim(),
    });
    closeEditor();
  };

  const handleDelete = (skill: Skill): void => {
    const confirmed = window.confirm(`确定删除技能「${skill.name}」吗？`);
    if (confirmed) {
      deleteSkill(skill.id);
      if (draft?.id === skill.id) closeEditor();
    }
  };

  const grouped = SKILL_CATEGORIES.map((category) => ({
    category,
    items: data.skills.filter((skill) => skill.category === category),
  }));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        label="技能 / skills"
        title="技能清单"
        description="按分类维护技能与熟练度，前台会以进度条的形式展示。"
        action={
          <button type="button" onClick={startCreate} className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            新增技能
          </button>
        }
      />

      {draft ? (
        <form onSubmit={handleSubmit} noValidate className="panel p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label-mono">
                {draft.id ? "编辑技能 / edit" : "新增技能 / new"}
              </p>
              <h2 className="mt-2 font-serif text-xl text-star">
                {draft.id ? "修改技能信息" : "添加一项技能"}
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
              <label htmlFor="skill-name" className="field-label">
                技能名称
              </label>
              <input
                id="skill-name"
                type="text"
                value={draft.name}
                onChange={(event) => patchDraft("name", event.target.value)}
                className="field"
                placeholder="例如 TypeScript"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.name}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="skill-category" className="field-label">
                分类
              </label>
              <select
                id="skill-category"
                value={draft.category}
                onChange={(event) =>
                  patchDraft("category", event.target.value as SkillCategory)
                }
                className="field"
              >
                {SKILL_CATEGORIES.map((category) => (
                  <option key={category} value={category} className="bg-space-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <label htmlFor="skill-level" className="field-label">
                  熟练度
                </label>
                <span className="font-mono text-[11px] text-accent-soft">
                  {draft.level}%
                </span>
              </div>
              <input
                id="skill-level"
                type="range"
                min={0}
                max={100}
                step={1}
                value={draft.level}
                onChange={(event) => patchDraft("level", Number(event.target.value))}
                className="mt-1 w-full accent-[#8fa8ff]"
              />
              {errors.level ? (
                <p className="mt-1 text-xs text-rose-300">{errors.level}</p>
              ) : (
                <p className="mt-1 text-xs text-star-faint">0 - 100，整数。</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="skill-note" className="field-label">
                备注（可选）
              </label>
              <input
                id="skill-note"
                type="text"
                value={draft.note}
                onChange={(event) => patchDraft("note", event.target.value)}
                className="field"
                placeholder="一句话说明你如何使用它"
                aria-invalid={Boolean(errors.note)}
              />
              {errors.note ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.note}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" aria-hidden="true" />
              {draft.id ? "保存修改" : "添加技能"}
            </button>
            <button type="button" onClick={closeEditor} className="btn-ghost">
              取消
            </button>
          </div>
        </form>
      ) : null}

      <section className="space-y-7" aria-label="技能列表">
        {grouped.map((group) => (
          <div key={group.category}>
            <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-2">
              <h2 className="font-serif text-lg text-star">
                {group.category}
                <span className="ml-2 font-mono text-[9px] uppercase tracking-widest text-star-faint">
                  {group.items.length} items
                </span>
              </h2>
              <span className="font-mono text-[10px] text-star-faint">
                平均{" "}
                {group.items.length === 0
                  ? "—"
                  : `${Math.round(
                      group.items.reduce((total, skill) => total + skill.level, 0) /
                        group.items.length,
                    )}%`}
              </span>
            </div>
            {group.items.length === 0 ? (
              <p className="mt-3 border border-dashed border-white/10 px-4 py-5 text-xs text-star-faint">
                该分类还没有技能，点击「新增技能」添加。
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {group.items.map((skill) => (
                  <li
                    key={skill.id}
                    className="panel panel-hover flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 sm:w-44 sm:shrink-0">
                      <p className="truncate text-sm text-star">{skill.name}</p>
                      <p className="mt-1 font-mono text-[9px] tracking-wide text-star-faint">
                        {skill.category}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-1 flex-1 bg-white/[0.07]">
                          <div
                            className="h-full bg-gradient-to-r from-accent-deep to-accent-soft"
                            style={{
                              width: `${Math.min(100, Math.max(0, skill.level))}%`,
                            }}
                          />
                        </div>
                        <span className="w-9 shrink-0 text-right font-mono text-[10px] text-star-dim">
                          {skill.level}%
                        </span>
                      </div>
                      {skill.note ? (
                        <p className="mt-2 truncate text-xs text-star-faint">
                          {skill.note}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(skill)}
                        aria-label={`编辑 ${skill.name}`}
                        className={cn(
                          "grid h-8 w-8 place-items-center border border-white/10 text-star-dim",
                          "transition-colors hover:border-accent/50 hover:text-star",
                        )}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(skill)}
                        aria-label={`删除 ${skill.name}`}
                        className="grid h-8 w-8 place-items-center border border-white/10 text-star-dim transition-colors hover:border-rose-400/50 hover:text-rose-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
