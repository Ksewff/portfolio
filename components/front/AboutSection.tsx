"use client";

import { useSiteData } from "@/components/SiteDataProvider";
import Section from "@/components/front/Section";

const PRINCIPLES = [
  {
    title: "先结构，后装饰",
    body: "信息层级清晰之后，视觉才有存在的理由。每个区块先回答「用户要做什么」。",
  },
  {
    title: "为失败设计路径",
    body: "空状态、错误提示与弱网都是产品的一部分，它们应该和主路径同样被认真对待。",
  },
  {
    title: "让动效回答动作",
    body: "动效用来解释状态变化，而不是填满页面。克制的一次过渡胜过十处漂浮。",
  },
];

export default function AboutSection() {
  const { data } = useSiteData();

  return (
    <Section
      id="about"
      label="关于 / about"
      title="把复杂留给自己，把清晰留给使用者。"
      description={`${data.profile.yearsOfExperience} 年产品工程经验，横跨设计与前端实现。`}
    >
      <div className="grid gap-12 md:grid-cols-5 md:gap-10">
        <div className="md:col-span-3">
          <p className="font-serif text-xl leading-9 text-star/90">
            {data.profile.bio}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/[0.07] pt-5 font-mono text-[11px] tracking-wide text-star-faint">
            <span>当前状态：{data.profile.availability}</span>
            <span>常驻：{data.profile.location}</span>
          </div>
        </div>
        <ul className="md:col-span-2">
          {PRINCIPLES.map((item) => (
            <li key={item.title} className="border-t border-white/[0.08] py-5 first:border-t-0 first:pt-0">
              <h3 className="text-sm text-star">{item.title}</h3>
              <p className="mt-2 text-[13px] leading-6 text-star-dim">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
