import { Container } from "@/components/ui/Container";
import { WindowPanel } from "@/components/ui/WindowPanel";
import { features } from "@/data/products";

export function FeatureGrid() {
  return (
    <section id="builds" aria-labelledby="features-heading" className="pb-12">
      <Container>
        <div className="mb-6 text-center">
          <h2
            id="features-heading"
            className="font-serif text-[26px] sm:text-[32px]"
          >
            Why builders choose KeyVault
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-body">
            Six tools styled like system utilities — everything you need to
            plan, compare, and complete a mechanical keyboard build.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <WindowPanel
              key={feature.title}
              title={`utility_${String(index + 1).padStart(2, "0")}.exe`}
            >
              <h3 className="font-serif text-lg text-heading">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-body">{feature.description}</p>
            </WindowPanel>
          ))}
        </div>
      </Container>
    </section>
  );
}
