"use client";

import { Container } from "@/components/ui/Container";
import { RetroButton } from "@/components/ui/RetroButton";
import { RetroInput } from "@/components/ui/RetroInput";
import { WindowPanel } from "@/components/ui/WindowPanel";
import { FormEvent, useState } from "react";

export function NewsletterSection() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section aria-labelledby="newsletter-heading" className="pb-12">
      <Container>
        <WindowPanel title="group_buy_alerts.mail" floating active>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <h2
                id="newsletter-heading"
                className="font-serif text-[26px] sm:text-[32px]"
              >
                Get group buy alerts
              </h2>
              <p className="mt-2 text-body">
                Subscribe for drop notifications, restock pings, and retro
                patch notes from the KeyVault desk.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <RetroInput
                label="Email address"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
              <RetroButton type="submit" className="w-full sm:w-auto">
                Sign up &amp; claim alerts
              </RetroButton>
              {submitted && (
                <p className="font-mono text-xs text-success" role="status">
                  &gt; subscription queued — check your inbox to confirm.
                </p>
              )}
              <p className="text-xs text-body-subtle">
                One list per account. Unsubscribe anytime. Terms apply.
              </p>
            </form>
          </div>
        </WindowPanel>
      </Container>
    </section>
  );
}
