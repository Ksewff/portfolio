"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  FolderKanban,
  Inbox,
  RotateCcw,
  Sparkles,
  UserRound,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatCard from "@/components/admin/StatCard";
import { useSiteData } from "@/components/SiteDataProvider";
import { formatDateTime } from "@/lib/utils";

const QUICK_LINKS = [
  { href: "/admin/profile", label: "编辑个人信息", hint: "姓名、简介与联系方式", icon: UserRound },
  { href: "/admin/projects", label: "管理项目", hint: "增删改精选作品", icon: FolderKanban },
  { href: "/admin/blog", label: "撰写日志", hint: "发布或保存草稿", icon: FileText },
  { href: "/admin/skills", label: "更新技能", hint: "分类与熟练度", icon: Sparkles },
];

export default function AdminDashboardPage() {
  const { data, resetData } = useSiteData();
  const unread = data.messages.filter((message) => !message.read).length;
  const publishedPosts = data.posts.filter((post) => post.published).length;

  const recentMessages = [...data.messages]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  const recentPosts = [...data.posts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  const handleReset = (): void => {
    const confirmed = window.confirm(
      "确定恢复默认内容吗？当前对个人信息、技能、项目、日志和消息的所有修改都会被清除。",
    );
    if (confirmed) {
      resetData();
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        label="概览 / overview"
        title={`你好，${data.profile.name}`}
        description="这里是内容的总览。所有修改会立即保存到 localStorage，并同步显示在前台。"
        action={
          <Link href="/admin/profile" className="btn-ghost">
            编辑资料
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="内容统计">
        <StatCard
          label="项目"
          value={String(data.projects.length)}
          hint={`${data.projects.filter((item) => item.featured).length} 个精选`}
          icon={FolderKanban}
        />
        <StatCard
          label="技能"
          value={String(data.skills.length)}
          hint="覆盖前端 / 后端 / 设计 / 工具"
          icon={Sparkles}
        />
        <StatCard
          label="日志"
          value={String(data.posts.length)}
          hint={`${publishedPosts} 篇已发布`}
          icon={FileText}
        />
        <StatCard
          label="未读消息"
          value={String(unread)}
          hint={`共 ${data.messages.length} 条`}
          icon={Inbox}
        />
      </section>

      <section aria-label="快捷操作">
        <p className="label-mono">快捷入口 / quick actions</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="panel panel-hover group flex items-start gap-3 p-4"
              >
                <Icon className="mt-0.5 h-4 w-4 text-accent-soft" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-[13px] text-star">{item.label}</span>
                  <span className="mt-1 block text-xs text-star-faint">{item.hint}</span>
                </span>
                <ArrowUpRight
                  className="ml-auto h-3.5 w-3.5 shrink-0 text-star-faint transition-colors group-hover:text-accent-soft"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel" aria-label="最新消息">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
            <h2 className="font-serif text-lg text-star">最新消息</h2>
            <Link
              href="/admin/messages"
              className="font-mono text-[10px] tracking-wide text-star-faint transition-colors hover:text-star"
            >
              全部 {data.messages.length} 条
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-star-dim">收件箱还是空的。</p>
              <p className="mt-1 text-xs text-star-faint">
                访客通过前台联系表单发送的消息会出现在这里。
              </p>
            </div>
          ) : (
            <ul>
              {recentMessages.map((message) => (
                <li
                  key={message.id}
                  className="border-b border-white/[0.06] px-5 py-4 last:border-b-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm text-star">
                      {message.name}
                      <span className="ml-2 font-mono text-[10px] text-star-faint">
                        {message.email}
                      </span>
                    </p>
                    <span className="shrink-0 font-mono text-[9px] text-star-faint">
                      {formatDateTime(message.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-star-dim">
                    {message.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel" aria-label="最近日志">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
            <h2 className="font-serif text-lg text-star">最近日志</h2>
            <Link
              href="/admin/blog"
              className="font-mono text-[10px] tracking-wide text-star-faint transition-colors hover:text-star"
            >
              管理日志
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-star-dim">还没有日志。</p>
              <p className="mt-1 text-xs text-star-faint">去「日志」页面写下第一篇吧。</p>
            </div>
          ) : (
            <ul>
              {recentPosts.map((post) => (
                <li
                  key={post.id}
                  className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-star">{post.title}</p>
                    <p className="mt-1 font-mono text-[9px] tracking-wide text-star-faint">
                      {post.publishedAt} · {post.tags.join(" / ") || "未分类"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 border px-2 py-1 font-mono text-[9px] tracking-wide ${
                      post.published
                        ? "border-emerald-400/30 text-emerald-200"
                        : "border-white/15 text-star-faint"
                    }`}
                  >
                    {post.published ? "已发布" : "草稿"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="flex flex-col gap-4 border border-white/[0.08] bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-star">数据存储于当前浏览器</p>
          <p className="mt-1 text-xs leading-5 text-star-faint">
            清理浏览器数据会一并删除内容。演示环境中可用「恢复默认数据」重置全部内容。
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex shrink-0 items-center gap-2 border border-white/15 px-3 py-2 font-mono text-[10px] tracking-wide text-star-dim transition-colors hover:border-rose-400/50 hover:text-rose-200"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          恢复默认数据
        </button>
      </section>
    </div>
  );
}
