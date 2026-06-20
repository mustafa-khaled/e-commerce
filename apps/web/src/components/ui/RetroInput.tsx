import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

type RetroInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function RetroInput({ label, className, id, ...props }: RetroInputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="block w-full">
      {label && (
        <span className="mb-1 block font-sans text-[13px] font-medium text-heading">
          {label}
        </span>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-[var(--radius-base)] border border-border-default bg-neutral-secondary-soft px-3 py-2 font-sans text-sm text-body placeholder:text-body-subtle focus:border-border-brand focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--border-brand)_35%,transparent)]",
          className,
        )}
        {...props}
      />
    </label>
  );
}
