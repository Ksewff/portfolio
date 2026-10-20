"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import { useSiteData } from "@/components/SiteDataProvider";

export default function Hero() {
  const { data } = useSiteData();
  const { profile } = data;
  const [avatarFailed, setAvatarFailed] = useState(false);
  const publishedPosts = data.posts.filter((post) => post.published).length;

  const archiveRows = [
    { term: "坐标", detail: profile.location },
    { term: "在轨时间", detail: `${profile.yearsOfExperience} 年` },
    { term: "已交付", detail: `${profile.projectsShipped} 个项目` },
    { term: "公开日志", detail: `${publishedPosts} 篇` },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="shell relative grid gap-16 pb-20 pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-24">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 animate-fade-up">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-soft" />
            </span>
            <p className="label-mono text-star-dim">{profile.availability}</p>
          </div>

          <h1 className="mt-8 font-serif text-hero text-star animate-fade-up [animation-delay:80ms]">
            {profile.name}
          </h1>

          <div className="mt-8 flex max-w-xl items-start gap-4 animate-fade-up [animation-delay:180ms]">
            <span
              className="mt-2 hidden h-px w-12 shrink-0 bg-accent/70 sm:block"
              aria-hidden="true"
            />
            <div>
              <p className="font-mono text-[11px] tracking-widest text-accent-soft">
                {profile.role}
              </p>
              <p className="mt-4 text-lg leading-8 text-star-dim sm:text-xl sm:leading-9">
                {profile.tagline}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 animate-fade-up [animation-delay:260ms]">
            <Link href="/#work" className="btn-primary">
              查看作品
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={profile.resumeUrl}
              className="btn-ghost"
              target={profile.resumeUrl.startsWith("http") ? "_blank" : undefined}
              rel={profile.resumeUrl.startsWith("http") ? "noreferrer" : undefined}
            >
              下载简历
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/[0.07] pt-6 font-mono text-[11px] tracking-wide text-star-faint animate-fade-up [animation-delay:340ms]">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {profile.location}
            </span>
            <span>30.2741° N / 120.1551° E</span>
            <span className="hidden sm:inline">UTC+08:00 · 夜空晴朗</span>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <svg
            viewBox="0 0 240 240"
            className="pointer-events-none absolute -right-14 -top-16 hidden h-64 w-64 text-accent/25 lg:block"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="120" cy="120" r="86" stroke="currentColor" strokeDasharray="2 7" />
            <circle cx="120" cy="120" r="58" stroke="currentColor" opacity="0.6" />
            <path d="M120 8v18M120 214v18M8 120h18M214 120h18" stroke="currentColor" />
            <circle cx="120" cy="34" r="3" fill="#A5B4FC" />
          </svg>

          <div className="panel relative p-5 shadow-panel backdrop-blur-md sm:p-6 animate-fade-up [animation-delay:220ms]">
            <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-accent/70" aria-hidden="true" />
            <span className="absolute -right-px -top-px h-3 w-3 border-r border-t border-accent/70" aria-hidden="true" />
            <span className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-accent/70" aria-hidden="true" />
            <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-accent/70" aria-hidden="true" />

            <div className="flex items-center justify-between">
              <p className="label-mono">观测档案 / profile</p>
              <p className="font-mono text-[10px] tracking-widest text-accent-soft">
                NO. 001
              </p>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden border border-white/15 bg-space-700">
                {avatarFailed || profile.avatar === "" ? (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-accent-deep/60 to-space-700 font-serif text-2xl text-star">
                    {profile.name.slice(0, 1)}
                  </div>
                ) : (
                  <img
                    src={profile.avatar}
                    alt={`${profile.name} 的头像`}
                    width={72}
                    height={72}
                    className="h-full w-full object-cover"
                    onError={() => setAvatarFailed(true)}
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-serif text-xl text-star">{profile.name}</p>
                <p className="mt-1 font-mono text-[10px] tracking-wide text-star-dim">
                  {profile.role}
                </p>
              </div>
            </div>

            <dl className="mt-6 border-y border-white/[0.07]">
              {archiveRows.map((row) => (
                <div
                  key={row.term}
                  className="flex items-baseline justify-between gap-4 border-b border-white/[0.05] py-2.5 last:border-b-0"
                >
                  <dt className="font-mono text-[10px] tracking-widest text-star-faint">
                    {row.term}
                  </dt>
                  <dd className="truncate text-right text-[13px] text-star">{row.detail}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 font-mono text-[10px] leading-5 tracking-wide text-star-faint">
              当前坐标稳定，信号良好。欢迎通过下方频道建立联络。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
