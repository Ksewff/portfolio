"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LockKeyhole, Menu, X } from "lucide-react";
import { useSiteData } from "@/components/SiteDataProvider";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/#work", label: "作品" },
  { href: "/#skills", label: "技能" },
  { href: "/blog", label: "日志" },
  { href: "/#contact", label: "联系" },
];

export default function Navbar() {
  const { data } = useSiteData();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled
          ? "border-white/[0.08] bg-space/85 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="shell flex h-[68px] items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3" aria-label="返回首页">
          <span className="relative grid h-8 w-8 place-items-center border border-accent/40">
            <span className="absolute h-px w-4 bg-accent/50" />
            <span className="absolute h-4 w-px bg-accent/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent-soft transition-colors group-hover:bg-signal" />
          </span>
          <span className="leading-none">
            <span className="block font-serif text-[15px] tracking-wide text-star">
              {data.profile.name}
            </span>
            <span className="mt-1 block font-mono text-[9px] uppercase tracking-widest text-star-faint">
              personal observatory
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="主导航">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] uppercase tracking-widest text-star-dim transition-colors hover:text-star"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden items-center gap-2 border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-star-dim transition-colors hover:border-accent/50 hover:text-star sm:inline-flex"
          >
            <LockKeyhole className="h-3 w-3" aria-hidden="true" />
            后台
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-9 w-9 place-items-center border border-white/10 text-star-dim transition-colors hover:border-accent/50 hover:text-star md:hidden"
            aria-expanded={open}
            aria-label={open ? "关闭菜单" : "打开菜单"}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          className="border-t border-white/[0.08] bg-space/95 px-5 py-4 backdrop-blur-xl md:hidden"
          aria-label="移动端导航"
        >
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between border-b border-white/[0.06] py-3 font-mono text-xs uppercase tracking-widest text-star-dim"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <span className="text-star-faint">↗</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/admin"
                className="flex items-center justify-between py-3 font-mono text-xs uppercase tracking-widest text-star-dim"
                onClick={() => setOpen(false)}
              >
                后台管理
                <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
