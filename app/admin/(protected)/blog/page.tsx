"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useSiteData } from "@/components/SiteDataProvider";
import { createId } from "@/lib/storage";
import type { BlogPost } from "@/lib/types";
import { slugify } from "@/lib/utils";

interface PostDraft {
  id: string | null;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  tags: string;
  publishedAt: string;
  published: boolean;
}

interface PostErrors {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  cover?: string;
  tags?: string;
  publishedAt?: string;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_DRAFT: PostDraft = {
  id: null,
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover: "",
  tags: "",
  publishedAt: today(),
  published: false,
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

function validatePost(draft: PostDraft, posts: BlogPost[]): PostErrors {
  const errors: PostErrors = {};
  const title = draft.title.trim();
  const slug = draft.slug.trim();
  const excerpt = draft.excerpt.trim();
  const content = draft.content.trim();

  if (title.length < 2) errors.title = "标题至少 2 个字符";
  else if (title.length > 80) errors.title = "标题不超过 80 个字符";

  if (slug.length === 0) {
    errors.slug = "请填写 URL 标识";
  } else if (!/^[\p{L}\p{N}-]+$/u.test(slug)) {
    errors.slug = "标识只能包含文字、数字与连字符";
  } else if (slug.length > 80) {
    errors.slug = "标识不超过 80 个字符";
  } else if (
    posts.some((post) => post.slug === slug && post.id !== draft.id)
  ) {
    errors.slug = "该标识已被其他文章使用";
  }

  if (excerpt.length < 10) errors.excerpt = "摘要至少 10 个字符";
  else if (excerpt.length > 200) errors.excerpt = "摘要不超过 200 个字符";

  if (content.length < 30) errors.content = "正文至少 30 个字符";
  if (draft.cover.trim().length > 500) errors.cover = "封面内容过长";

  const tags = parseTags(draft.tags);
  if (tags.length > 8) errors.tags = "最多 8 个标签";
  else if (tags.some((tag) => tag.length > 20)) errors.tags = "单个标签不超过 20 个字符";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.publishedAt.trim())) {
    errors.publishedAt = "请选择发布日期";
  } else if (Number.isNaN(new Date(`${draft.publishedAt}T00:00:00`).getTime())) {
    errors.publishedAt = "日期无效";
  }

  return errors;
}

export default function AdminBlogPage() {
  const { data, savePost, deletePost } = useSiteData();
  const [draft, setDraft] = useState<PostDraft | null>(null);
  const [errors, setErrors] = useState<PostErrors>({});
  const [slugTouched, setSlugTouched] = useState(false);

  const startCreate = (): void => {
    setDraft({ ...EMPTY_DRAFT });
    setErrors({});
    setSlugTouched(false);
  };

  const startEdit = (post: BlogPost): void => {
    setDraft({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      cover: post.cover,
      tags: post.tags.join(", "),
      publishedAt: post.publishedAt,
      published: post.published,
    });
    setErrors({});
    setSlugTouched(true);
  };

  const closeEditor = (): void => {
    setDraft(null);
    setErrors({});
  };

  const patchDraft = <K extends keyof PostDraft>(key: K, value: PostDraft[K]): void => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    if (
      key === "title" ||
      key === "slug" ||
      key === "excerpt" ||
      key === "content" ||
      key === "cover" ||
      key === "tags" ||
      key === "publishedAt"
    ) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  const handleTitleChange = (value: string): void => {
    setDraft((current) =>
      current
        ? { ...current, title: value, slug: slugTouched ? current.slug : slugify(value) }
        : current,
    );
    setErrors((current) => ({ ...current, title: undefined, slug: undefined }));
  };

  const handleSlugChange = (value: string): void => {
    setSlugTouched(true);
    patchDraft("slug", value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!draft) return;
    const nextErrors = validatePost(draft, data.posts);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    savePost({
      id: draft.id ?? createId("post"),
      slug: draft.slug.trim(),
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      content: draft.content.trim(),
      cover: draft.cover.trim(),
      tags: parseTags(draft.tags),
      publishedAt: draft.publishedAt,
      published: draft.published,
    });
    closeEditor();
  };

  const togglePublished = (post: BlogPost): void => {
    savePost({ ...post, published: !post.published });
  };

  const handleDelete = (post: BlogPost): void => {
    const confirmed = window.confirm(
      `确定删除日志「${post.title}」吗？该操作无法撤销。`,
    );
    if (confirmed) {
      deletePost(post.id);
      if (draft?.id === post.id) closeEditor();
    }
  };

  const sortedPosts = [...data.posts].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        label="日志 / field notes"
        title="日志管理"
        description="撰写、发布或撤回观测日志。草稿不会出现在前台日志列表中。"
        action={
          <button type="button" onClick={startCreate} className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            新建日志
          </button>
        }
      />

      {draft ? (
        <form onSubmit={handleSubmit} noValidate className="panel p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label-mono">
                {draft.id ? "编辑日志 / edit" : "新建日志 / new"}
              </p>
              <h2 className="mt-2 font-serif text-xl text-star">
                {draft.id ? "修改这篇日志" : "写下新的观测记录"}
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
            <div className="sm:col-span-2">
              <label htmlFor="post-title" className="field-label">
                标题
              </label>
              <input
                id="post-title"
                type="text"
                value={draft.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                className="field"
                placeholder="例如：克制的界面，少即是更难的选择"
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.title}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="post-slug" className="field-label">
                URL 标识（slug）
              </label>
              <input
                id="post-slug"
                type="text"
                value={draft.slug}
                onChange={(event) => handleSlugChange(event.target.value)}
                className="field font-mono text-xs"
                placeholder="designing-with-restraint"
                aria-invalid={Boolean(errors.slug)}
              />
              {errors.slug ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.slug}</p>
              ) : (
                <p className="mt-1.5 text-xs text-star-faint">
                  前台地址：/blog/{draft.slug || "..."}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="post-date" className="field-label">
                发布日期
              </label>
              <input
                id="post-date"
                type="date"
                value={draft.publishedAt}
                onChange={(event) => patchDraft("publishedAt", event.target.value)}
                className="field"
                aria-invalid={Boolean(errors.publishedAt)}
              />
              {errors.publishedAt ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.publishedAt}</p>
              ) : null}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="post-tags" className="field-label">
                标签
              </label>
              <input
                id="post-tags"
                type="text"
                value={draft.tags}
                onChange={(event) => patchDraft("tags", event.target.value)}
                className="field"
                placeholder="设计, 方法论"
                aria-invalid={Boolean(errors.tags)}
              />
              {errors.tags ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.tags}</p>
              ) : (
                <p className="mt-1.5 text-xs text-star-faint">
                  用逗号分隔，最多 8 个；会用于日志列表筛选。
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="post-excerpt" className="field-label">
                摘要
              </label>
              <textarea
                id="post-excerpt"
                rows={3}
                value={draft.excerpt}
                onChange={(event) => patchDraft("excerpt", event.target.value)}
                className="field resize-y"
                placeholder="一两句话说明这篇文章解决了什么问题。"
                aria-invalid={Boolean(errors.excerpt)}
              />
              {errors.excerpt ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.excerpt}</p>
              ) : (
                <p className="mt-1.5 text-xs text-star-faint">
                  当前 {draft.excerpt.trim().length} 个字符，建议 40 - 120 字。
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="post-content" className="field-label">
                正文
              </label>
              <textarea
                id="post-content"
                rows={14}
                value={draft.content}
                onChange={(event) => patchDraft("content", event.target.value)}
                className="field resize-y font-mono text-[13px] leading-7"
                placeholder={"## 小标题\n\n普通段落直接书写。\n\n- 列表项一\n- 列表项二"}
                aria-invalid={Boolean(errors.content)}
              />
              {errors.content ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.content}</p>
              ) : (
                <p className="mt-1.5 text-xs text-star-faint">
                  支持简单格式：以「## 」开头为小标题，以「- 」开头为列表项。
                  当前 {draft.content.trim().length} 个字符。
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="post-cover" className="field-label">
                封面
              </label>
              <textarea
                id="post-cover"
                rows={2}
                value={draft.cover}
                onChange={(event) => patchDraft("cover", event.target.value)}
                className="field resize-y font-mono text-xs"
                placeholder="图片 URL，或 CSS 渐变（linear-gradient(...)），留空使用默认封面"
                aria-invalid={Boolean(errors.cover)}
              />
              {errors.cover ? (
                <p className="mt-1.5 text-xs text-rose-300">{errors.cover}</p>
              ) : null}
            </div>
            <div className="sm:col-span-2 border-t border-white/[0.08] pt-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(event) => patchDraft("published", event.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#8fa8ff]"
                />
                <span>
                  <span className="block text-sm text-star">立即发布</span>
                  <span className="mt-0.5 block text-xs text-star-faint">
                    取消勾选则以草稿保存，不会出现在前台。
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" aria-hidden="true" />
              {draft.id ? "保存修改" : draft.published ? "发布日志" : "保存草稿"}
            </button>
            <button type="button" onClick={closeEditor} className="btn-ghost">
              取消
            </button>
            {draft.id && draft.published ? (
              <Link
                href={`/blog/${draft.slug}`}
                target="_blank"
                className="font-mono text-[10px] tracking-wide text-star-faint transition-colors hover:text-star"
              >
                预览前台文章 ↗
              </Link>
            ) : null}
          </div>
        </form>
      ) : null}

      <section aria-label="日志列表">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/[0.08] pb-2">
          <h2 className="font-serif text-lg text-star">
            全部日志
            <span className="ml-2 font-mono text-[9px] uppercase tracking-widest text-star-faint">
              {data.posts.length} total
            </span>
          </h2>
          <span className="font-mono text-[10px] text-star-faint">
            已发布 {data.posts.filter((post) => post.published).length} · 草稿{" "}
            {data.posts.filter((post) => !post.published).length}
          </span>
        </div>

        {sortedPosts.length === 0 ? (
          <div className="mt-4 border border-dashed border-white/10 p-8 text-center">
            <p className="text-sm text-star-dim">还没有日志。</p>
            <p className="mt-1 text-xs text-star-faint">
              点击「新建日志」，记录下第一个判断。
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {sortedPosts.map((post) => (
              <li
                key={post.id}
                className="panel panel-hover flex flex-col gap-4 p-4 lg:flex-row lg:items-start"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] tracking-widest text-star-faint">
                    <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                    {post.tags.length > 0 ? (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{post.tags.join(" / ")}</span>
                      </>
                    ) : null}
                    <span
                      className={`border px-1.5 py-0.5 text-[8px] ${
                        post.published
                          ? "border-emerald-400/30 text-emerald-200"
                          : "border-amber-300/30 text-amber-200"
                      }`}
                    >
                      {post.published ? "已发布" : "草稿"}
                    </span>
                  </div>
                  <p className="mt-2 truncate font-serif text-base text-star">
                    {post.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-star-dim">
                    {post.excerpt}
                  </p>
                  <p className="mt-2 truncate font-mono text-[9px] tracking-wide text-star-faint">
                    /blog/{post.slug}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {post.published ? (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      aria-label={`查看 ${post.title}`}
                      className="grid h-8 w-8 place-items-center border border-white/10 text-star-dim transition-colors hover:border-accent/50 hover:text-star"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => togglePublished(post)}
                    aria-label={post.published ? `撤回 ${post.title}` : `发布 ${post.title}`}
                    className="grid h-8 w-8 place-items-center border border-white/10 text-star-dim transition-colors hover:border-accent/50 hover:text-star"
                  >
                    {post.published ? (
                      <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(post)}
                    aria-label={`编辑 ${post.title}`}
                    className="grid h-8 w-8 place-items-center border border-white/10 text-star-dim transition-colors hover:border-accent/50 hover:text-star"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post)}
                    aria-label={`删除 ${post.title}`}
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
