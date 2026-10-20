import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
}

export default function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <div className="panel panel-hover p-5">
      <div className="flex items-center justify-between">
        <p className="label-mono">{label}</p>
        <Icon className="h-4 w-4 text-accent-soft" aria-hidden="true" />
      </div>
      <p className="mt-5 font-serif text-4xl text-star">{value}</p>
      <p className="mt-1.5 text-xs text-star-faint">{hint}</p>
    </div>
  );
}
