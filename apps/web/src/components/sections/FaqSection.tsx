"use client";

import { Container } from "@/components/ui/Container";
import { RetroButton } from "@/components/ui/RetroButton";
import { RetroInput } from "@/components/ui/RetroInput";
import { WindowPanel } from "@/components/ui/WindowPanel";
import { faqs } from "@/data/products";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { useMemo, useState } from "react";

const quickLinks = [
  { label: "Shipping & delivery", href: "#shipping" },
  { label: "Returns & warranty", href: "#returns" },
  { label: "Group buy FAQ", href: "#group-buys" },
  { label: "Contact support", href: "#support" },
];

export function FaqSection() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return faqs;
    return faqs.filter(
      (item) =>
        item.question.toLowerCase().includes(normalized) ||
        item.answer.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <section id="support" aria-labelledby="faq-heading" className="pb-12">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <WindowPanel title="help_center.exe" floating>
            <h2
              id="faq-heading"
              className="font-serif text-[26px] sm:text-[32px]"
            >
              Frequently asked questions
            </h2>
            <p className="mt-2 text-body">
              Search the knowledge base or expand a question below.
            </p>

            <div className="mt-4">
              <RetroInput
                label="Search FAQ"
                placeholder="e.g. group buy, returns, compatibility"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="mt-6 divide-y divide-[var(--border-default)] rounded-[var(--radius-base)] border border-border-default">
              {filtered.map((item, index) => {
                const isOpen = openIndex === index;
                const panelId = `faq-panel-${index}`;
                const buttonId = `faq-button-${index}`;

                return (
                  <div key={item.question} className="bg-neutral-primary-soft">
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() =>
                          setOpenIndex(isOpen ? null : index)
                        }
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-sans text-sm font-medium text-heading hover:bg-neutral-secondary-medium"
                      >
                        {item.question}
                        <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isOpen}
                      className={cn(
                        "border-t border-border-default px-4 py-3 text-sm text-body",
                        !isOpen && "hidden",
                      )}
                    >
                      {item.answer}
                    </div>
                  </div>
                );
              })}
            </div>
          </WindowPanel>

          <WindowPanel title="quick_links.sys">
            <h3 className="font-serif text-lg text-heading">Quick links</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-[var(--radius-base)] border border-border-default px-3 py-2 font-sans text-sm text-heading no-underline hover:bg-neutral-secondary-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <RetroButton className="mt-4 w-full" variant="tertiary">
              Open full help center
            </RetroButton>
          </WindowPanel>
        </div>
      </Container>
    </section>
  );
}
