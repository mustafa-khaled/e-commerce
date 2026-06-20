import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type FileChipProps = {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  className?: string;
};

export function FileChip({ label, icon, active, className }: FileChipProps) {
  return (
    <div
      className={cn(
        "flex min-w-[120px] flex-col items-center gap-2 rounded-[var(--radius-base)] border bg-white p-3 text-center transition-colors",
        active
          ? "border-brand bg-brand-softer"
          : "border-border-default hover:border-brand hover:bg-brand-softer",
        className,
      )}
    >
      <div
        className="flex size-12 items-center justify-center rounded-[var(--radius-base)] bg-brand text-white"
        aria-hidden="true"
      >
        {icon ?? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" />
          </svg>
        )}
      </div>
      <span className="font-sans text-xs font-medium text-heading">{label}</span>
    </div>
  );
}
