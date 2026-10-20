import type { SiteData } from "./types";

export const defaultSiteData: SiteData = {
  profile: {
    name: "林知远",
    role: "产品工程师 · 界面设计",
    tagline: "在逻辑与诗意之间，构建可以被人记住的界面。",
    bio: "我是一名独立的产品工程师，专注于把复杂系统整理成清晰、克制、有温度的数字产品。过去七年，我在设计稿与生产代码之间来回穿梭，相信好的界面来自对细节的偏执与对使用者的耐心。",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=linzhiyuan&backgroundColor=111827",
    location: "中国 · 杭州",
    email: "hello@linzhiyuan.dev",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    resumeUrl: "#",
    availability: "接受 2026 年 Q1 的合作项目",
    yearsOfExperience: 7,
    projectsShipped: 32,
  },
  skills: [
    { id: "skill-1", name: "TypeScript", category: "前端", level: 92, note: "类型系统与大型前端架构" },
    { id: "skill-2", name: "React / Next.js", category: "前端", level: 94, note: "App Router、RSC、性能优化" },
    { id: "skill-3", name: "Tailwind CSS", category: "前端", level: 90, note: "设计系统与响应式实现" },
    { id: "skill-4", name: "Canvas / WebGL", category: "前端", level: 78, note: "数据可视化与动效" },
    { id: "skill-5", name: "Node.js", category: "后端", level: 85, note: "API 设计与服务端渲染" },
    { id: "skill-6", name: "PostgreSQL", category: "后端", level: 76, note: "数据建模与查询优化" },
    { id: "skill-7", name: "界面设计", category: "设计", level: 88, note: "信息架构与视觉系统" },
    { id: "skill-8", name: "动效设计", category: "设计", level: 82, note: "交互节奏与微动效" },
    { id: "skill-9", name: "Git / CI", category: "工具", level: 89, note: "协作流程与自动化" },
    { id: "skill-10", name: "Figma", category: "工具", level: 91, note: "组件库与交付规范" },
  ],
  projects: [
    {
      id: "project-1",
      title: "Orbit 观测台",
      description:
        "面向天文爱好者的实时观测计划工具，整合同步星图、天气窗口与观测日志。核心挑战是在弱网环境下保持星图的流畅渲染。",
      cover:
        "linear-gradient(135deg, #101a33 0%, #1e1b4b 48%, #0b0f1a 100%)",
      link: "https://example.com/orbit",
      tags: ["Next.js", "Canvas", "PostgreSQL"],
      year: "2025",
      featured: true,
    },
    {
      id: "project-2",
      title: "Atlas 设计系统",
      description:
        "为一家 SaaS 公司从零搭建的多品牌设计系统，包含 120+ 组件、主题令牌与自动化视觉回归测试。",
      cover:
        "linear-gradient(135deg, #1a1530 0%, #312e81 52%, #0b0f1a 100%)",
      link: "https://example.com/atlas",
      tags: ["TypeScript", "Design Tokens", "Storybook"],
      year: "2024",
      featured: true,
    },
    {
      id: "project-3",
      title: "静默信号",
      description:
        "一个极简的写作与阅读应用，用可折叠的时间轴组织长文。上线六个月内获得 1.2 万名自然用户。",
      cover:
        "linear-gradient(135deg, #0f1c1a 0%, #134e4a 55%, #0b0f1a 100%)",
      link: "https://example.com/signal",
      tags: ["React", "Node.js", "Product"],
      year: "2023",
      featured: true,
    },
    {
      id: "project-4",
      title: "Delta 数据面板",
      description:
        "为物流团队重构的运营看板，将每日决策时间从 40 分钟压缩到 9 分钟，并支持离线快照。",
      cover:
        "linear-gradient(135deg, #1b1424 0%, #4c1d95 50%, #0b0f1a 100%)",
      link: "https://example.com/delta",
      tags: ["Data Viz", "React", "D3"],
      year: "2023",
      featured: false,
    },
  ],
  posts: [
    {
      id: "post-1",
      slug: "designing-with-restraint",
      title: "克制的界面：少即是更难的选择",
      excerpt:
        "当所有产品都在争夺注意力时，克制反而成为最稀缺的设计能力。聊聊我在真实项目中做减法的方法。",
      content:
        "## 少不是空\n\n克制并不等于把页面留白到没有信息。它意味着每一个元素都必须回答一个问题：如果删掉它，用户会失去什么？\n\n## 三个减法练习\n\n1. 先把所有装饰性元素标灰，只保留承载信息的部分。\n2. 检查每个强调色是否对应一个明确的动作。\n3. 让动效只出现在状态真正发生改变的时刻。\n\n当我按照这三个练习重做 Orbis 的首页时，页面的转化率并没有下降，反而因为路径更清晰提升了 18%。",
      cover:
        "linear-gradient(135deg, #131a2c 0%, #3730a3 55%, #0b0f1a 100%)",
      tags: ["设计", "方法论"],
      publishedAt: "2025-11-08",
      published: true,
    },
    {
      id: "post-2",
      slug: "canvas-starfield-performance",
      title: "让星空动起来：Canvas 性能笔记",
      excerpt:
        "移动端降级、像素比处理与帧率控制——把一片星空塞进 60fps 预算里的实践记录。",
      content:
        "## 从 DOM 到 Canvas\n\n用 DOM 绘制几百颗星星会让浏览器不断重排。切换到 Canvas 之后，绘制成本变得可控。\n\n## 关键细节\n\n- 根据 devicePixelRatio 缩放画布，避免高分屏发虚。\n- 在移动端减少星星数量并关闭视差，稳定帧率。\n- 监听 visibilitychange，页面不可见时暂停 requestAnimationFrame。\n- 尊重 prefers-reduced-motion，为晕动症用户提供静态星空。\n\n这些处理加起来不到 120 行代码，却让低端设备上的掉帧问题彻底消失。",
      cover:
        "linear-gradient(135deg, #0d1726 0%, #1e3a8a 52%, #0b0f1a 100%)",
      tags: ["前端", "性能"],
      publishedAt: "2025-09-21",
      published: true,
    },
    {
      id: "post-3",
      slug: "typescript-boundaries",
      title: "在边界处使用 TypeScript",
      excerpt:
        "类型不是文档的替代品。把类型集中在数据边界上，才能让重构变得安全而轻快。",
      content:
        "## 边界思维\n\n外部数据进入系统的位置——API 响应、localStorage、表单输入——才是类型真正需要守卫的地方。\n\n## 实践\n\n为每个存储键定义版本号与解析函数，读取时校验结构、失败时回落到默认值。这样即使数据结构演进，用户也不会看到白屏。\n\n内部逻辑则尽量依赖推导，避免为每个变量手写类型。类型应该降低维护成本，而不是增加它。",
      cover:
        "linear-gradient(135deg, #101a2e 0%, #312e81 50%, #0b0f1a 100%)",
      tags: ["TypeScript", "工程化"],
      publishedAt: "2025-07-02",
      published: true,
    },
  ],
  messages: [],
};
