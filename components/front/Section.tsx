import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({
  id,
  label,
  title,
  description,
  children,
  className = "",
}: SectionProps) {
  return (
    <section id={id} className={`border-t border-white/[0.07] ${className}`}>
      <div className="shell grid gap-10 py-20 lg:grid-cols-12 lg:gap-14 lg:py-24">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="label-mono">{label}</p>
            <h2 className="section-title mt-4">{title}</h2>
            {description ? (
              <p className="mt-4 max-w-xs text-sm leading-7 text-star-dim">{description}</p>
            ) : null}
          </div>
        </div>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}
