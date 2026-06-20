import { Container } from "@/components/ui/Container";
import { WindowPanel } from "@/components/ui/WindowPanel";
import { stats, testimonials } from "@/data/products";

export function SocialProof() {
  return (
    <section aria-labelledby="social-heading" className="pb-12">
      <Container>
        <WindowPanel title="community.stats" floating active>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2
                id="social-heading"
                className="font-serif text-[26px] sm:text-[32px]"
              >
                Trusted by the thock squad
              </h2>
              <p className="mt-2 text-body">
                Real builders, real reviews — framed like a retro system report.
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[var(--radius-base)] border border-border-default bg-neutral-secondary-soft p-3"
                  >
                    <dt className="font-sans text-xs text-body-subtle">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 font-serif text-2xl text-heading">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="space-y-3">
              {testimonials.map((item) => (
                <blockquote
                  key={item.author}
                  className="rounded-[var(--radius-base)] border border-border-default bg-neutral-primary-soft p-4"
                >
                  <p className="text-sm text-body">&ldquo;{item.quote}&rdquo;</p>
                  <footer className="mt-3 flex items-center justify-between gap-2">
                    <cite className="not-italic">
                      <span className="block font-sans text-sm font-medium text-heading">
                        {item.author}
                      </span>
                      <span className="font-mono text-xs text-body-subtle">
                        {item.role}
                      </span>
                    </cite>
                    <span
                      className="font-mono text-xs text-fg-brand"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {"★".repeat(item.rating)}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </WindowPanel>
      </Container>
    </section>
  );
}
