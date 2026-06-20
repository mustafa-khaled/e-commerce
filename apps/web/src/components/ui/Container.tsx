import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--container-max)] px-4 sm:px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
