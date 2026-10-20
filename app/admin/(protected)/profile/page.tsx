"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Check, Save } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useSiteData } from "@/components/SiteDataProvider";
import type { Profile } from "@/lib/types";
import { isValidEmail, isValidUrl } from "@/lib/utils";

type ProfileErrors = Partial<Record<keyof Profile, string>>;
type TextFieldKey = Exclude<keyof Profile, "yearsOfExperience" | "projectsShipped">;

interface TextField {
  key: TextFieldKey;
  label: string;
  placeholder: string;
  hint?: string;
  wide?: boolean;
}

const TEXT_FIELDS: TextField[] = [
  { key: "name", label: "姓名", placeholder: "林知远" },
  { key: "role", label: "职位", placeholder: "产品工程师 · 界面设计" },
  {
    key: "tagline",
    label: "一句话介绍",
    placeholder: "在逻辑与诗意之间，构建可以被人记住的界面。",
    wide: true,
  },
  { key: "location", label: "所在地", placeholder: "中国 · 杭州" },
  { key: "email", label: "邮箱", placeholder: "hello@example.com" },
  {
    key: "avatar",
    label: "头像地址",
    placeholder: "https://... 或留空使用首字母",
    hint: "支持图片 URL；加载失败时自动显示姓名首字。",
    wide: true,
  },
  { key: "github", label: "GitHub 链接", placeholder: "https://github.com/..." },
  { key: "linkedin", label: "LinkedIn 链接", placeholder: "https://www.linkedin.com/..." },
  {
    key: "resumeUrl",
    label: "简历链接",
    placeholder: "https://... 或 #",
    hint: "前台「下载简历」按钮会跳转到该地址。",
    wide: true,
  },
  {
    key: "availability",
    label: "当前状态",
    placeholder: "接受 2026 年 Q1 的合作项目",
    wide: true,
  },
];

function validateProfile(values: Profile): ProfileErrors {
  const errors: ProfileErrors = {};
  if (values.name.trim().length < 2) errors.name = "姓名至少 2 个字符";
  if (values.role.trim().length < 2) errors.role = "请填写职位";
  if (values.tagline.trim().length < 10) errors.tagline = "一句话介绍至少 10 个字符";
  if (values.bio.trim().length < 20) errors.bio = "个人简介至少 20 个字符";
  if (!isValidEmail(values.email)) errors.email = "请填写有效的邮箱地址";
  if (!isValidUrl(values.avatar)) errors.avatar = "头像需要是有效的 http(s) 地址或留空";
  if (!isValidUrl(values.github)) errors.github = "GitHub 链接格式不正确";
  if (!isValidUrl(values.linkedin)) errors.linkedin = "LinkedIn 链接格式不正确";
  if (!isValidUrl(values.resumeUrl)) errors.resumeUrl = "简历链接格式不正确";
  if (
    !Number.isInteger(values.yearsOfExperience) ||
    values.yearsOfExperience < 0 ||
    values.yearsOfExperience > 60
  ) {
    errors.yearsOfExperience = "请输入 0 - 60 之间的整数";
  }
  if (
    !Number.isInteger(values.projectsShipped) ||
    values.projectsShipped < 0 ||
    values.projectsShipped > 999
  ) {
    errors.projectsShipped = "请输入 0 - 999 之间的整数";
  }
  return errors;
}

export default function AdminProfilePage() {
  const { data, updateProfile } = useSiteData();
  const [form, setForm] = useState<Profile>(data.profile);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saved, setSaved] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const updateField = <K extends keyof Profile>(key: K, value: Profile[K]): void => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSaved(false);
    if (key === "avatar") {
      setAvatarFailed(false);
    }
  };

  const handleNumberChange = (
    key: "yearsOfExperience" | "projectsShipped",
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    updateField(key, Number(event.target.value));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const nextErrors = validateProfile(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSaved(false);
      return;
    }
    updateProfile({
      ...form,
      name: form.name.trim(),
      role: form.role.trim(),
      tagline: form.tagline.trim(),
      bio: form.bio.trim(),
      email: form.email.trim(),
      location: form.location.trim(),
      avatar: form.avatar.trim(),
      github: form.github.trim(),
      linkedin: form.linkedin.trim(),
      resumeUrl: form.resumeUrl.trim(),
      availability: form.availability.trim(),
    });
    setSaved(true);
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        label="个人信息 / profile"
        title="编辑个人信息"
        description="这些内容会出现在首页 Hero、关于区块、联系表单与页脚中。保存后立即生效。"
      />

      <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <section className="panel p-5 sm:p-6">
            <p className="label-mono">基本资料 / basics</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {TEXT_FIELDS.slice(0, 5).map((field) => (
                <div key={field.key} className={field.wide ? "sm:col-span-2" : ""}>
                  <label htmlFor={`profile-${field.key}`} className="field-label">
                    {field.label}
                  </label>
                  <input
                    id={`profile-${field.key}`}
                    type="text"
                    value={form[field.key]}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    className="field"
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(errors[field.key])}
                  />
                  {errors[field.key] ? (
                    <p className="mt-1.5 text-xs text-rose-300">{errors[field.key]}</p>
                  ) : field.hint ? (
                    <p className="mt-1.5 text-xs text-star-faint">{field.hint}</p>
                  ) : null}
                </div>
              ))}
              <div className="sm:col-span-2">
                <label htmlFor="profile-bio" className="field-label">
                  个人简介
                </label>
                <textarea
                  id="profile-bio"
                  rows={5}
                  value={form.bio}
                  onChange={(event) => updateField("bio", event.target.value)}
                  className="field resize-y"
                  placeholder="介绍你的经历、关注方向与工作方式。"
                  aria-invalid={Boolean(errors.bio)}
                />
                {errors.bio ? (
                  <p className="mt-1.5 text-xs text-rose-300">{errors.bio}</p>
                ) : (
                  <p className="mt-1.5 text-xs text-star-faint">
                    当前 {form.bio.trim().length} 个字符，建议 80 - 200 字。
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="panel p-5 sm:p-6">
            <p className="label-mono">链接与状态 / links</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {TEXT_FIELDS.slice(5).map((field) => (
                <div key={field.key} className={field.wide ? "sm:col-span-2" : ""}>
                  <label htmlFor={`profile-${field.key}`} className="field-label">
                    {field.label}
                  </label>
                  <input
                    id={`profile-${field.key}`}
                    type="text"
                    value={form[field.key]}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    className="field"
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(errors[field.key])}
                  />
                  {errors[field.key] ? (
                    <p className="mt-1.5 text-xs text-rose-300">{errors[field.key]}</p>
                  ) : field.hint ? (
                    <p className="mt-1.5 text-xs text-star-faint">{field.hint}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-5 sm:p-6">
            <p className="label-mono">数字 / numbers</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="profile-years" className="field-label">
                  工作年限
                </label>
                <input
                  id="profile-years"
                  type="number"
                  min={0}
                  max={60}
                  step={1}
                  value={form.yearsOfExperience}
                  onChange={(event) => handleNumberChange("yearsOfExperience", event)}
                  className="field"
                  aria-invalid={Boolean(errors.yearsOfExperience)}
                />
                {errors.yearsOfExperience ? (
                  <p className="mt-1.5 text-xs text-rose-300">{errors.yearsOfExperience}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="profile-projects" className="field-label">
                  交付项目数
                </label>
                <input
                  id="profile-projects"
                  type="number"
                  min={0}
                  max={999}
                  step={1}
                  value={form.projectsShipped}
                  onChange={(event) => handleNumberChange("projectsShipped", event)}
                  className="field"
                  aria-invalid={Boolean(errors.projectsShipped)}
                />
                {errors.projectsShipped ? (
                  <p className="mt-1.5 text-xs text-rose-300">{errors.projectsShipped}</p>
                ) : null}
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" aria-hidden="true" />
              保存修改
            </button>
            {saved ? (
              <span
                className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-emerald-200"
                role="status"
                aria-live="polite"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                已保存到本地，前台将同步更新
              </span>
            ) : (
              <span className="font-mono text-[10px] tracking-wide text-star-faint">
                未保存的修改不会同步到前台
              </span>
            )}
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="panel sticky top-24 p-5">
            <p className="label-mono">实时预览 / preview</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden border border-white/15 bg-space-700">
                {avatarFailed || form.avatar.trim() === "" ? (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-accent-deep/60 to-space-700 font-serif text-xl text-star">
                    {form.name.slice(0, 1) || "?"}
                  </div>
                ) : (
                  <img
                    src={form.avatar}
                    alt="头像预览"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                    onError={() => setAvatarFailed(true)}
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-serif text-lg text-star">
                  {form.name || "未填写姓名"}
                </p>
                <p className="mt-1 truncate font-mono text-[10px] text-star-faint">
                  {form.role || "未填写职位"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-6 text-star-dim">
              {form.tagline || "一句话介绍会显示在这里。"}
            </p>
            <dl className="mt-5 border-t border-white/[0.08] pt-4 font-mono text-[10px] leading-6 tracking-wide text-star-faint">
              <div className="flex justify-between gap-3">
                <dt>所在地</dt>
                <dd className="truncate text-star-dim">{form.location || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>工作年限</dt>
                <dd className="text-star-dim">{form.yearsOfExperience} 年</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>交付项目</dt>
                <dd className="text-star-dim">{form.projectsShipped} 个</dd>
              </div>
            </dl>
            <p className="mt-5 border-t border-white/[0.08] pt-4 text-[11px] leading-5 text-star-faint">
              所有数据保存在浏览器 localStorage，清除站点数据会一并清除。
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
