"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useSiteData } from "@/components/SiteDataProvider";
import { coverStyle } from "@/lib/cover";
import { formatDate } from "@/lib/utils";

function renderContent(content: string): ReactNode {
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (): void => {
    if (listItems.length === 0) return;
    const items = [...listItems];
    listItems = [];
    blocks.push(
      <ul key={`list-${blocks.length}`} className="mb-6 list-disc space-y-2 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>,
    );
  };

  content.split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim();
    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      return;
    }
    flushList();
    if (line.length === 0) return;
    if (line.startsWith("## ")) {
      blocks.push(<h2 key={`h-${index}`}>{line.slice(3)}</h2>);
      return;
    }
    blocks.push(<p key={`p-${index}`}>{line}</p>);
  });
  flushList();

  return <>{blocks}</>;
}

export default function BlogArticle() {
  const params = useParams<{ slug: string }>();
  const { data, isReady } = useSiteData();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const post = data.posts.find((item) => item.slug === slug && item.published);

  if (!post) {
    if (!isReady) {
      return (
        <div className="shell py-24">
          <p className="font-mono text-[11px] tracking-widest text-star-faint">正在接收信号…</p>
        </div>
      );
    }
    return (
      <div className="shell py-24">
        <div className="panel mx-auto max-w-lg p-10 text-center">
          <p className="font-serif text-3xl text-star">信号丢失</p>
          <p className="mt-3 text-sm leading-6 text-star-dim">
            这篇文章不存在，可能已被删除或尚未发布。
          </p>
          <Link href="/blog" className="btn-ghost mt-6">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            返回日志列表
          </Link>
        </div>
      </div>
    );
  }

  const others = data.posts
    .filter((item) => item.published && item.id !== post.id)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 2);

  return (
    <article className="pb-24">
      <div className="shell pt-14 sm:pt-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wide text-star-faint transition-colors hover:text-star"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          全部日志
        </Link>

        <header className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-widest text-star-faint">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.tags.join(" / ")}</span>
            <span aria-hidden="true">·</span>
            <span>{Math.max(1, Math.round(post.content.length / 400))} 分钟阅读</span>
          </div>
          <h1 className="mt-5 font-serif text-display text-star">{post.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-star-dim">{post.excerpt}</p>
        </header>

        <div
          className="relative mt-12 h-48 overflow-hidden border border-white/[0.08] sm:h-64"
          style={coverStyle(post.cover)}
        >
          <div
            className="absolute inset-0 bg-grid-faint opacity-40 [background-size:32px_32px]"
            aria-hidden="true"
          />
          <span className="absolute bottom-5 left-5 font-mono text-[10px] tracking-widest text-white/60">
            field note / {post.publishedAt}
          </span>
        </div>

        <div className="prose-almanac mx-auto mt-14 max-w-3xl">
          {renderContent(post.content)}
        </div>

        <footer className="mx-auto mt-16 max-w-3xl border-t border-white/[0.08] pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-[10px] tracking-widest text-star-faint">
              写于 {post.publishedAt} · {data.profile.name}
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wide text-star-dim transition-colors hover:text-star"
            >
              返回日志
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </footer>
      </div>

      {others.length > 0 ? (
        <div className="shell mt-20">
          <p className="label-mono">继续阅读 / more notes</p>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {others.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/blog/${item.slug}`}
                  className="group panel panel-hover flex items-start justify-between gap-4 p-5"
                >
                  <span>
                    <span className="font-mono text-[10px] tracking-widest text-star-faint">
                      {item.publishedAt}
                    </span>
                    <span className="mt-2 block font-serif text-lg text-star transition-colors group-hover:text-accent-soft">
                      {item.title}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="mt-1 h-4 w-4 shrink-0 text-star-faint"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
