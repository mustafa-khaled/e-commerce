import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type RetroButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "success"
  | "danger";

type RetroButtonSize = "xs" | "sm" | "base" | "lg";

const variantClasses: Record<RetroButtonVariant, string> = {
  primary:
    "bg-button-primary text-white border-brand hover:bg-brand-strong",
  secondary:
    "bg-button-secondary text-white border-blue hover:bg-blue-strong",
  tertiary:
    "bg-button-tertiary text-heading border-border-default hover:bg-neutral-secondary-medium",
  ghost:
    "bg-transparent text-heading border-transparent hover:bg-neutral-secondary-medium",
  success: "bg-success text-white border-success hover:opacity-90",
  danger: "bg-danger text-white border-danger hover:opacity-90",
};

const sizeClasses: Record<RetroButtonSize, string> = {
  xs: "px-2 py-1 text-[11px]",
  sm: "px-2.5 py-[5px] text-xs",
  base: "px-3.5 py-[7px] text-[13px]",
  lg: "px-[18px] py-[9px] text-sm",
};

type RetroButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: RetroButtonVariant;
  size?: RetroButtonSize;
  children: ReactNode;
};

export function RetroButton({
  variant = "primary",
  size = "base",
  className,
  children,
  disabled,
  ...props
}: RetroButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-base)] border font-sans font-medium transition-colors duration-[120ms] active:translate-y-px active:[box-shadow:var(--inset-press)]",
        variantClasses[variant],
        sizeClasses[size],
        disabled &&
          "cursor-not-allowed border-border-default-subtle bg-disabled text-[var(--fg-disabled)] hover:bg-disabled active:translate-y-0 active:[box-shadow:none]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
