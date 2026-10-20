"use client";

import { useMemo, useState } from "react";
import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useSiteData } from "@/components/SiteDataProvider";
import type { ContactMessage } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";

type Filter = "all" | "unread" | "read";

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "全部" },
  { value: "unread", label: "未读" },
  { value: "read", label: "已读" },
];

export default function AdminMessagesPage() {
  const { data, toggleMessageRead, deleteMessage } = useSiteData();
  const [filter, setFilter] = useState<Filter>("all");

  const unreadCount = data.messages.filter((message) => !message.read).length;
  const readCount = data.messages.length - unreadCount;

  const messages = useMemo(() => {
    const sorted = [...data.messages].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    if (filter === "unread") return sorted.filter((message) => !message.read);
    if (filter === "read") return sorted.filter((message) => message.read);
    return sorted;
  }, [data.messages, filter]);

  const handleDelete = (message: ContactMessage): void => {
    const confirmed = window.confirm(`确定删除来自「${message.name}」的消息吗？`);
    if (confirmed) {
      deleteMessage(message.id);
    }
  };

  const markAllRead = (): void => {
    data.messages
      .filter((message) => !message.read)
      .forEach((message) => toggleMessageRead(message.id));
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        label="消息 / inbox"
        title="访客消息"
        description="来自前台联系表单的消息。标记已读只影响后台状态，不会删除内容。"
        action={
          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="btn-ghost disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MailOpen className="h-4 w-4" aria-hidden="true" />
            全部标为已读
          </button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2" role="group" aria-label="消息筛选">
          {FILTERS.map((item) => {
            const count =
              item.value === "all"
                ? data.messages.length
                : item.value === "unread"
                  ? unreadCount
                  : readCount;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                aria-pressed={filter === item.value}
                className={cn(
                  "border px-3 py-1.5 font-mono text-[10px] tracking-wide transition-colors",
                  filter === item.value
                    ? "border-accent/60 bg-accent/10 text-accent-soft"
                    : "border-white/10 text-star-dim hover:border-white/25 hover:text-star",
                )}
              >
                {item.label}
                <span className="ml-1.5 text-star-faint">{count}</span>
              </button>
            );
          })}
        </div>
        <p className="font-mono text-[10px] tracking-wide text-star-faint">
          未读 {unreadCount} / 共 {data.messages.length} 条
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="border border-dashed border-white/10 p-10 text-center">
          <p className="font-serif text-xl text-star">
            {filter === "all"
              ? "收件箱是空的"
              : filter === "unread"
                ? "没有未读消息"
                : "还没有已读消息"}
          </p>
          <p className="mt-2 text-sm text-star-dim">
            访客在前台提交联系表单后，消息会保存在这里。
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {messages.map((message) => (
            <li
              key={message.id}
              className={cn(
                "panel p-5",
                !message.read && "border-accent/30 bg-accent/[0.04]",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  {!message.read ? (
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-soft"
                      aria-label="未读"
                    />
                  ) : null}
                  <p className="truncate text-sm text-star">{message.name}</p>
                  <a
                    href={`mailto:${message.email}`}
                    className="truncate font-mono text-[10px] text-star-faint transition-colors hover:text-accent-soft"
                  >
                    {message.email}
                  </a>
                </div>
                <time
                  dateTime={message.createdAt}
                  className="shrink-0 font-mono text-[9px] tracking-wide text-star-faint"
                >
                  {formatDateTime(message.createdAt)}
                </time>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-[13px] leading-7 text-star-dim">
                {message.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
                <button
                  type="button"
                  onClick={() => toggleMessageRead(message.id)}
                  className="btn-mini"
                >
                  {message.read ? (
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <MailOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {message.read ? "标记为未读" : "标记为已读"}
                </button>
                <a href={`mailto:${message.email}`} className="btn-mini">
                  <Reply className="h-3.5 w-3.5" aria-hidden="true" />
                  邮件回复
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(message)}
                  className="ml-auto inline-flex items-center gap-1.5 border border-white/10 px-2.5 py-1.5 font-mono text-[11px] tracking-wide text-star-dim transition-colors hover:border-rose-400/50 hover:text-rose-200"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
