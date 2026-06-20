import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type TerminalReadoutProps = {
  children: ReactNode;
  className?: string;
  title?: string;
};

export function TerminalReadout({
  children,
  className,
  title = "system.log",
}: TerminalReadoutProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-base)] border border-border-default bg-code-bg font-mono text-sm text-code-text",
        className,
      )}
    >
      <div className="border-b border-border-default px-3 py-1.5 text-[11px] text-[var(--code-text)]/80">
        {title}
      </div>
      <pre className="overflow-x-auto p-3 text-[12px] leading-relaxed whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  );
}
