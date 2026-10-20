"use client";

import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { useSiteData } from "@/components/SiteDataProvider";

export default function Footer() {
  const { data } = useSiteData();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/[0.07]">
      <div className="shell grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="font-serif text-2xl text-star">{data.profile.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-7 text-star-dim">
            {data.profile.tagline}
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="label-mono">联络</p>
          <ul className="mt-4 space-y-2 text-sm text-star-dim">
            <li>
              <a
                href={`mailto:${data.profile.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-star"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                {data.profile.email}
              </a>
            </li>
            <li>
              <a
                href={data.profile.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-star"
              >
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
                GitHub
              </a>
            </li>
            <li>
              <a
                href={data.profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-star"
              >
                <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="label-mono">索引</p>
          <ul className="mt-4 space-y-2 text-sm text-star-dim">
            <li>
              <Link href="/blog" className="transition-colors hover:text-star">
                全部日志
              </Link>
            </li>
            <li>
              <Link href="/#work" className="transition-colors hover:text-star">
                精选作品
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 transition-colors hover:text-star"
              >
                管理后台
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="shell flex flex-col gap-2 border-t border-white/[0.06] py-6 font-mono text-[10px] uppercase tracking-widest text-star-faint sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} {data.profile.name}. all signals reserved.</p>
        <p>{data.profile.location} · 30.2741° N / 120.1551° E</p>
      </div>
    </footer>
  );
}
