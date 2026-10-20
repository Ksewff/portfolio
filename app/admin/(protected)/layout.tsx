"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  ExternalLink,
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useSiteData } from "@/components/SiteDataProvider";
import { getAdminSession, logout, subscribeAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "概览", icon: LayoutDashboard },
  { href: "/admin/profile", label: "个人信息", icon: UserRound },
  { href: "/admin/skills", label: "技能", icon: Sparkles },
  { href: "/admin/projects", label: "项目", icon: FolderKanban },
  { href: "/admin/blog", label: "日志", icon: FileText },
  { href: "/admin/messages", label: "消息", icon: Inbox },
];

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useSiteData();
  const [ready, setReady] = useState(false);
  const unreadCount = data.messages.filter((message) => !message.read).length;

  useEffect(() => {
    const check = (): void => {
      if (!getAdminSession()) {
        setReady(false);
        router.replace("/admin/login");
        return;
      }
      setReady(true);
    };
    check();
    return subscribeAuth(check);
  }, [router]);

  const handleLogout = (): void => {
    logout();
    router.replace("/admin/login");
  };

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center px-5">
        <p className="font-mono text-[11px] tracking-widest text-star-faint">
          正在验证访问权限…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:flex">
      <aside className="border-b border-white/[0.08] bg-space/60 backdrop-blur-md lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        <Link href="/" className="flex items-center gap-3 border-white/[0.08] p-5 lg:border-b">
          <span className="relative grid h-8 w-8 shrink-0 place-items-center border border-accent/40">
            <span className="absolute h-px w-4 bg-accent/50" />
            <span className="absolute h-4 w-px bg-accent/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent-soft" />
          </span>
          <span className="leading-none">
            <span className="block font-serif text-sm tracking-wide text-star">
              个人观测站
            </span>
            <span className="mt-1 block font-mono text-[9px] tracking-widest text-star-faint">
              admin console
            </span>
          </span>
        </Link>

        <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 border-l px-3 py-2.5 text-[13px] transition-colors",
                  active
                    ? "border-accent bg-accent/[0.08] text-star"
                    : "border-transparent text-star-dim hover:bg-white/[0.03] hover:text-star",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
                {item.href === "/admin/messages" && unreadCount > 0 ? (
                  <span className="ml-auto grid h-4 min-w-4 place-items-center bg-accent px-1 font-mono text-[9px] text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden border-t border-white/[0.08] p-5 lg:block">
          <p className="font-mono text-[9px] leading-5 tracking-widest text-star-faint">
            已登录：admin
            <br />
            会话有效期 8 小时
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/[0.08] bg-space/85 px-5 backdrop-blur-xl sm:px-8">
          <p className="font-mono text-[10px] tracking-widest text-star-faint">
            控制台 / console
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 border border-white/10 px-2.5 py-1.5 font-mono text-[10px] tracking-wide text-star-dim transition-colors hover:border-accent/50 hover:text-star"
            >
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              查看前台
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 border border-white/10 px-2.5 py-1.5 font-mono text-[10px] tracking-wide text-star-dim transition-colors hover:border-rose-400/50 hover:text-rose-200"
            >
              <LogOut className="h-3 w-3" aria-hidden="true" />
              退出
            </button>
          </div>
        </header>

        <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
