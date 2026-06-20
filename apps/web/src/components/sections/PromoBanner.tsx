import { Container } from "@/components/ui/Container";

export function PromoBanner() {
  return (
    <div className="py-3">
      <Container>
        <div
          className="mx-auto flex max-w-2xl items-center justify-center rounded-[var(--radius-base)] border border-border-default bg-neutral-primary-soft px-4 py-2 text-center shadow-[var(--shadow-menu)]"
          role="status"
        >
          <p className="font-mono text-xs text-body sm:text-[13px]">
            <span className="font-semibold text-fg-brand">SYSTEM:</span> Free
            shipping on orders over $99 — use code{" "}
            <span className="text-heading">THOCK99</span>
          </p>
        </div>
      </Container>
    </div>
  );
}
