"use client";

import { Container } from "@/components/ui/Container";
import { RetroButton } from "@/components/ui/RetroButton";
import { RetroInput } from "@/components/ui/RetroInput";
import { categoryNav, navLinks } from "@/data/products";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { useState } from "react";

export function StoreNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-default bg-menu-bar">
      <Container>
        <div className="flex min-h-[var(--menu-bar-height)] items-center gap-3 py-2">
          <RetroInput
            aria-label="Search products"
            placeholder="Search boards, switches, keycaps..."
            className="hidden max-w-xs sm:block lg:max-w-sm"
          />

          <div className="flex flex-1 items-center justify-center">
            <Link
              href="/"
              className="font-serif text-lg font-medium text-heading no-underline sm:text-xl"
            >
              KeyVault.exe
            </Link>
          </div>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-[var(--radius-base)] px-2.5 py-1.5 font-sans text-[13px] font-medium text-heading no-underline hover:bg-neutral-secondary-medium"
              >
                {link.label}
              </Link>
            ))}
            <RetroButton variant="ghost" size="sm" aria-label="View cart">
              Cart (0)
            </RetroButton>
            <RetroButton variant="primary" size="sm">
              Account
            </RetroButton>
          </div>

          <RetroButton
            variant="ghost"
            size="sm"
            className="md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((open) => !open)}
          >
            Menu
          </RetroButton>
        </div>

        <nav
          id="mobile-nav"
          aria-label="Product categories"
          className={cn(
            "flex flex-wrap gap-1 border-t border-border-default py-2",
            !mobileOpen && "hidden md:flex",
            mobileOpen && "flex md:flex",
          )}
        >
          {categoryNav.map((item, index) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "rounded-[var(--radius-base)] px-2.5 py-1 font-sans text-xs font-medium no-underline",
                index === 0
                  ? "bg-neutral-secondary-strong text-fg-brand-strong"
                  : "text-body hover:bg-neutral-secondary-medium hover:text-heading",
              )}
            >
              {item}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
