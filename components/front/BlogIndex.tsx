"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useSiteData } from "@/components/SiteDataProvider";
import { coverStyle } from "@/lib/cover";

export default function BlogIndex() {
  const { data } = useSiteData();
  const [activeTag, setActiveTag] = useState("全部");

  const posts = useMemo(
    () =>
      [...data.posts]
        .filter((post) => post.published)
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    [data.posts],
  );

  const tags = useMemo(
    () => ["全部", ...Array.from(new Set(posts.flatMap((post) => post.tags)))],
    [posts],
  );

  const visiblePosts =
    activeTag === "全部" ? posts : posts.filter((post) => post.tags.includes(activeTag));

  return (
    <div className="shell pb-24 pt-14 sm:pt-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wide text-star-faint transition-colors hover:text-star"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        返回首页
      </Link>

      <header className="mt-10 grid gap-6 border-b border-white/[0.08] pb-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="label-mono">日志 / field notes</p>
          <h1 className="mt-4 font-serif text-display text-star">观测日志</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-star-dim">
            记录界面背后的判断：为什么保留，为什么删除，以及那些在实现过程中才浮现的答案。
          </p>
        </div>
        <div className="md:col-span-4 md:text-right">
          <p className="font-mono text-[10px] tracking-widest text-star-faint">
            已公开 {posts.length} 篇
          </p>
        </div>
      </header>

      {tags.length > 1 ? (
        <div className="flex flex-wrap gap-2 border-b border-white/[0.06] py-5">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`border px-3 py-1.5 font-mono text-[10px] tracking-wide transition-colors ${
                activeTag === tag
                  ? "border-accent/60 bg-accent/10 text-accent-soft"
                  : "border-white/10 text-star-dim hover:border-white/25 hover:text-star"
              }`}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}

      {visiblePosts.length === 0 ? (
        <div className="panel mt-10 p-12 text-center">
          <p className="font-serif text-2xl text-star">这里还没有记录</p>
          <p className="mt-2 text-sm leading-6 text-star-dim">
            调整筛选条件，或前往后台发布第一篇文章。
          </p>
        </div>
      ) : (
        <ul className="mt-2">
          {visiblePosts.map((post) => (
            <li key={post.id} className="border-b border-white/[0.08]">
              <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-5 py-8 transition-colors md:grid-cols-12 md:items-center md:gap-8"
              >
                <div
                  className="relative hidden h-24 overflow-hidden border border-white/[0.08] md:col-span-3 md:block"
                  style={coverStyle(post.cover)}
                >
                  <div
                    className="absolute inset-0 bg-grid-faint opacity-40 [background-size:22px_22px]"
                    aria-hidden="true"
                  />
                  <span className="absolute bottom-3 left-3 font-mono text-[9px] tracking-widest text-white/60">
                    {post.publishedAt}
                  </span>
                </div>
                <div className="md:col-span-8">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-widest text-star-faint">
                    <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.tags.join(" / ")}</span>
                  </div>
                  <h2 className="mt-3 font-serif text-2xl text-star transition-colors group-hover:text-accent-soft">
                    {post.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-[13px] leading-6 text-star-dim">
                    {post.excerpt}
                  </p>
                </div>
                <div className="hidden justify-end md:col-span-1 md:flex">
                  <span className="grid h-10 w-10 place-items-center border border-white/10 text-star-faint transition-colors group-hover:border-accent/50 group-hover:text-accent-soft">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
