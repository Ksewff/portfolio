import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  label: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function AdminPageHeader({
  label,
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="label-mono">{label}</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-star">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-star-dim">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
