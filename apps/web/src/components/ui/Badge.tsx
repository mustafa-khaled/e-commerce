import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "brand" | "neutral" | "success" | "warning" | "danger";
  pill?: boolean;
  className?: string;
};

const variantClasses = {
  brand: "bg-brand-soft text-fg-brand-strong border-brand",
  neutral: "bg-neutral-secondary-soft text-heading border-border-default",
  success: "bg-success-soft text-success border-success",
  warning: "bg-warning-soft text-[var(--warning)] border-[var(--warning)]",
  danger: "bg-danger-soft text-danger border-danger",
};

export function Badge({
  children,
  variant = "neutral",
  pill = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 font-sans text-[11px] font-medium",
        pill ? "rounded-full" : "rounded-[var(--radius-base)]",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
