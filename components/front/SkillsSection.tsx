"use client";

import { useSiteData } from "@/components/SiteDataProvider";
import Section from "@/components/front/Section";
import { SKILL_CATEGORIES } from "@/lib/types";

export default function SkillsSection() {
  const { data } = useSiteData();
  const groups = SKILL_CATEGORIES.map((category) => ({
    category,
    items: data.skills.filter((skill) => skill.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <Section
      id="skills"
      label="技能 / capabilities"
      title="工具会变，判断力不会。"
      description="以下是日常工作里反复使用的技术与手法，进度条代表熟练度而非绝对标准。"
    >
      {groups.length === 0 ? (
        <div className="panel p-10 text-center">
          <p className="font-serif text-xl text-star">技能清单为空</p>
          <p className="mt-2 text-sm text-star-dim">登录后台即可添加你的第一项技能。</p>
        </div>
      ) : (
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.category}>
              <div className="flex items-baseline justify-between border-b border-white/[0.1] pb-2">
                <h3 className="font-mono text-[11px] tracking-widest text-accent-soft">
                  {group.category}
                </h3>
                <span className="font-mono text-[10px] text-star-faint">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>
              <ul className="mt-4 space-y-5">
                {group.items.map((skill) => (
                  <li key={skill.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-sm text-star">{skill.name}</span>
                      <span className="font-mono text-[10px] text-star-faint">
                        {skill.level}
                      </span>
                    </div>
                    <div className="mt-2 h-px w-full bg-white/[0.09]" aria-hidden="true">
                      <div
                        className="h-px bg-accent transition-[width] duration-700"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    {skill.note ? (
                      <p className="mt-2 text-xs leading-5 text-star-faint">{skill.note}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
