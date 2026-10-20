"use client";

import { ArrowUpRight } from "lucide-react";
import { useSiteData } from "@/components/SiteDataProvider";
import Section from "@/components/front/Section";
import { coverStyle } from "@/lib/cover";

export default function ProjectsSection() {
  const { data } = useSiteData();
  const projects = [...data.projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured),
  );

  return (
    <Section
      id="work"
      label="作品 / selected work"
      title="经过打磨的观测记录。"
      description="挑选了几个完整落地的产品：从信息架构到最后一像素的动效。"
    >
      {projects.length === 0 ? (
        <div className="panel p-10 text-center">
          <p className="font-serif text-xl text-star">暂未记录项目</p>
          <p className="mt-2 text-sm text-star-dim">
            前往后台添加第一个项目，它会立即出现在这里。
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.link || "#"}
              target={project.link.startsWith("http") ? "_blank" : undefined}
              rel={project.link.startsWith("http") ? "noreferrer" : undefined}
              className="group panel panel-hover flex flex-col overflow-hidden"
            >
              <div
                className="relative h-44 border-b border-white/[0.06]"
                style={coverStyle(project.cover)}
              >
                <div
                  className="absolute inset-0 bg-grid-faint opacity-50 [background-size:26px_26px]"
                  aria-hidden="true"
                />
                <span className="absolute left-4 top-4 font-mono text-[10px] tracking-widest text-white/60">
                  {project.year}
                </span>
                <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center border border-white/20 text-white/70 transition-colors group-hover:border-accent-soft group-hover:bg-accent/20 group-hover:text-white">
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {project.featured ? (
                  <span className="absolute bottom-4 left-4 border border-white/20 bg-space/50 px-2 py-1 font-mono text-[9px] tracking-widest text-star backdrop-blur-sm">
                    精选
                  </span>
                ) : null}
                <span className="absolute bottom-4 right-4 font-serif text-lg text-white/90">
                  {project.title}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-serif text-xl text-star">{project.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-star-dim">
                  {project.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {project.tags.map((tag) => (
                    <span
                      key={`${project.id}-${tag}`}
                      className="border border-white/10 px-2 py-1 font-mono text-[10px] tracking-wide text-star-faint"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </Section>
  );
}
