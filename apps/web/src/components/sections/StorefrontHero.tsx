import { Container } from "@/components/ui/Container";
import { RetroButton } from "@/components/ui/RetroButton";
import { TerminalReadout } from "@/components/ui/TerminalReadout";
import { WindowPanel } from "@/components/ui/WindowPanel";

const heroFeatures = [
  { label: "Hot-swap boards", value: "24 in stock" },
  { label: "Switch packs", value: "70+ variants" },
  { label: "Group buys", value: "3 live now" },
];

const deals = [
  { name: "Nova 75 Bundle", price: "$219", note: "Board + sampler" },
  { name: "Terminal Keycaps", price: "$139", note: "GB ending soon" },
  { name: "Lube Starter Kit", price: "$29", note: "Ships today" },
];

export function StorefrontHero() {
  return (
    <section aria-labelledby="hero-heading" className="pb-10 pt-4">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <WindowPanel title="KeyVault Storefront — v1.0" floating active>
            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="font-mono text-xs text-body-subtle">
                  C:\keyvault\storefront\
                </p>
                <h1
                  id="hero-heading"
                  className="mt-2 font-serif text-[30px] leading-[1.05] tracking-[-0.5px] sm:text-[38px] lg:text-[52px]"
                >
                  Build the board you believe in.
                </h1>
                <p className="mt-4 max-w-xl text-[15px] text-body">
                  A retro desktop shop for mechanical keyboards — curated
                  boards, switches, keycaps, and tools with spec readouts you
                  can trust.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <RetroButton size="lg">Shop keyboards</RetroButton>
                  <RetroButton variant="tertiary" size="lg">
                    Browse switches
                  </RetroButton>
                </div>
              </div>

              <TerminalReadout title="boot.log" className="lg:min-w-[260px]">
                {`> keyvault --boot --shop=mechanical

> loading catalog .............. OK
> switches online .............. 70+
> keycap group buys ............ 3 active
> compatibility checker ........ ready

> press ENTER to shop`}
              </TerminalReadout>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {heroFeatures.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[var(--radius-base)] border border-border-default bg-neutral-secondary-soft p-3"
                >
                  <p className="font-sans text-xs font-medium text-body-subtle">
                    {item.label}
                  </p>
                  <p className="mt-1 font-mono text-sm text-heading">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </WindowPanel>

          <WindowPanel title="Deal Carousel.sys" floating>
            <p className="font-sans text-sm text-body-subtle">
              Featured offers this week
            </p>
            <ul className="mt-4 space-y-3">
              {deals.map((deal) => (
                <li
                  key={deal.name}
                  className="flex items-center justify-between rounded-[var(--radius-base)] border border-border-default bg-neutral-secondary-soft px-3 py-2"
                >
                  <div>
                    <p className="font-sans text-sm font-medium text-heading">
                      {deal.name}
                    </p>
                    <p className="font-mono text-xs text-body-subtle">
                      {deal.note}
                    </p>
                  </div>
                  <span className="font-serif text-lg text-fg-brand-strong">
                    {deal.price}
                  </span>
                </li>
              ))}
            </ul>
            <RetroButton className="mt-4 w-full" variant="secondary">
              View all deals
            </RetroButton>
          </WindowPanel>
        </div>
      </Container>
    </section>
  );
}
