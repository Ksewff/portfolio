"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useSiteData } from "@/components/SiteDataProvider";
import Section from "@/components/front/Section";
import { formatDate } from "@/lib/utils";

export default function BlogPreview() {
  const { data } = useSiteData();
  const posts = [...data.posts]
    .filter((post) => post.published)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  return (
    <Section
      id="writing"
      label="日志 / field notes"
      title="写下来的思考。"
      description="关于界面、工程与产品判断的记录，偶尔也写星空。"
    >
      <div className="mb-6 flex justify-end">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wide text-star-dim transition-colors hover:text-star"
        >
          全部日志
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="panel p-10 text-center">
          <p className="font-serif text-xl text-star">还没有公开的日志</p>
          <p className="mt-2 text-sm text-star-dim">在后台写一篇并设为发布，它会出现在这里。</p>
        </div>
      ) : (
        <ul className="border-t border-white/[0.08]">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-white/[0.08]">
              <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-3 py-6 transition-colors sm:grid-cols-12 sm:items-baseline sm:gap-6"
              >
                <time
                  dateTime={post.publishedAt}
                  className="font-mono text-[10px] tracking-widest text-star-faint sm:col-span-2"
                >
                  {post.publishedAt}
                </time>
                <div className="sm:col-span-8">
                  <h3 className="font-serif text-xl text-star transition-colors group-hover:text-accent-soft">
                    {post.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[13px] leading-6 text-star-dim">
                    {post.excerpt}
                  </p>
                  <p className="mt-3 font-mono text-[10px] tracking-wide text-star-faint">
                    {post.tags.join(" · ")} · {formatDate(post.publishedAt)}
                  </p>
                </div>
                <div className="hidden justify-end sm:col-span-2 sm:flex">
                  <span className="grid h-9 w-9 place-items-center border border-white/10 text-star-faint transition-colors group-hover:border-accent/50 group-hover:text-accent-soft">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
