import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type WindowPanelProps = {
  title: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  floating?: boolean;
  active?: boolean;
  controls?: boolean;
};

export function WindowPanel({
  title,
  children,
  className,
  bodyClassName,
  floating = false,
  active = false,
  controls = false,
}: WindowPanelProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-base)] border bg-white text-heading",
        active
          ? "border-brand shadow-[var(--shadow-window)]"
          : "border-border-default",
        floating && "shadow-[var(--shadow-window)]",
        className,
      )}
    >
      <div
        className="flex h-10 items-center border-b border-border-default bg-white px-4"
        role="presentation"
      >
        <div className="flex min-w-0 items-center gap-2">
          {controls && (
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-brand" />
              <span className="size-2.5 rounded-full bg-blue" />
              <span className="size-2.5 rounded-full bg-neutral-secondary" />
            </div>
          )}
          <span className="truncate font-sans text-xs font-semibold uppercase tracking-wider text-heading">
            {title}
          </span>
        </div>
      </div>
      <div className={cn("p-5 sm:p-6", bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
