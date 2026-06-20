"use client";

import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { RetroButton } from "@/components/ui/RetroButton";
import { WindowPanel } from "@/components/ui/WindowPanel";
import { featuredProducts } from "@/data/products";
import { cn } from "@/lib/cn";
import { useMemo, useState } from "react";

const filters = [
  { label: "All", value: null },
  { label: "Keyboards", value: "keyboards" },
  { label: "Switches", value: "switches" },
  { label: "Keycaps", value: "keycaps" },
  { label: "Tools", value: "tools" },
] as const;

function badgeVariant(
  badge?: string,
): "brand" | "neutral" | "success" | "warning" | "danger" {
  switch (badge) {
    case "Group Buy":
      return "brand";
    case "Limited":
      return "warning";
    case "Pre-Order":
      return "neutral";
    default:
      return "success";
  }
}

export function ProductCards() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeFilter) return featuredProducts;
    return featuredProducts.filter(
      (product) => product.category === activeFilter,
    );
  }, [activeFilter]);

  return (
    <section id="featured" aria-labelledby="products-heading" className="pb-12">
      <Container>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="products-heading"
              className="font-serif text-[26px] sm:text-[32px]"
            >
              Featured products
            </h2>
            <p className="mt-2 text-body">
              Configurable cards with live specs — filter by category in the
              sidebar.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <WindowPanel title="Filters.app" bodyClassName="p-3">
            <fieldset>
              <legend className="mb-3 font-sans text-xs font-semibold uppercase tracking-wide text-body-subtle">
                Category
              </legend>
              <div className="space-y-1">
                {filters.map((filter) => (
                  <button
                    key={filter.label}
                    type="button"
                    onClick={() => setActiveFilter(filter.value)}
                    className={cn(
                      "w-full rounded-[var(--radius-base)] border px-2.5 py-2 text-left font-sans text-[13px] transition-colors",
                      activeFilter === filter.value
                        ? "border-border-default-strong bg-neutral-secondary-strong text-fg-brand-strong"
                        : "border-transparent text-body hover:border-border-default hover:bg-neutral-secondary-medium hover:text-heading",
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </WindowPanel>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <WindowPanel
                key={product.id}
                title={product.id}
                bodyClassName="p-0"
              >
                <div
                  className={cn(
                    "flex h-36 items-end border-b border-border-default bg-gradient-to-br p-4",
                    product.imageGradient,
                  )}
                  aria-hidden="true"
                >
                  {product.badge && (
                    <Badge variant={badgeVariant(product.badge)}>
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="font-serif text-lg text-heading">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-body">{product.description}</p>
                  </div>
                  <dl className="space-y-1 font-mono text-[11px] text-body-subtle">
                    {product.layout && (
                      <div className="flex justify-between gap-2">
                        <dt>Layout</dt>
                        <dd className="text-heading">{product.layout}</dd>
                      </div>
                    )}
                    {product.switchType && (
                      <div className="flex justify-between gap-2">
                        <dt>Switch</dt>
                        <dd className="text-heading">{product.switchType}</dd>
                      </div>
                    )}
                    {product.actuation && (
                      <div className="flex justify-between gap-2">
                        <dt>Actuation</dt>
                        <dd className="text-heading">{product.actuation}</dd>
                      </div>
                    )}
                  </dl>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div>
                      <p className="font-serif text-xl text-fg-brand-strong">
                        ${product.price}
                      </p>
                      <p className="font-sans text-xs text-body-subtle">
                        {product.rating}★ ({product.reviewCount})
                      </p>
                    </div>
                    <RetroButton size="sm">Add to cart</RetroButton>
                  </div>
                </div>
              </WindowPanel>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
