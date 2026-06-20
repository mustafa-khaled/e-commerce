import { Container } from "@/components/ui/Container";
import { FileChip } from "@/components/ui/FileChip";
import { WindowPanel } from "@/components/ui/WindowPanel";
import { categories } from "@/data/products";

const specs = [
  { label: "Layouts", value: "60%, 65%, 75%, TKL, Full" },
  { label: "Mount types", value: "Gasket, tray, top mount" },
  { label: "Switch sockets", value: "MX hot-swap (5-pin)" },
  { label: "Keycap profile", value: "Cherry, OEM, SA" },
];

export function ProductCategories() {
  return (
    <section id="shop" aria-labelledby="categories-heading" className="pb-12">
      <Container>
        <div className="mb-6">
          <h2
            id="categories-heading"
            className="font-serif text-[26px] sm:text-[32px]"
          >
            Shop by folder
          </h2>
          <p className="mt-2 max-w-2xl text-body">
            Browse categories like vintage directories — each folder opens a
            curated collection for your next build.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="no-underline"
            >
              <FileChip label={category.label} />
            </a>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {categories.slice(0, 2).map((category, index) => (
            <WindowPanel
              key={category.id}
              title={`${category.label}.txt`}
              className={index % 2 === 1 ? "lg:mt-8" : ""}
            >
              <h3 className="font-serif text-xl text-heading">
                {category.label}
              </h3>
              <p className="mt-2 text-sm text-body">{category.description}</p>
              <p className="mt-4 font-mono text-xs text-body-subtle">
                Double-click to open catalog →
              </p>
            </WindowPanel>
          ))}
        </div>

        <WindowPanel title="compatibility.spec" className="mt-6">
          <h3 className="font-serif text-xl text-heading">
            Build compatibility at a glance
          </h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse font-sans text-sm">
              <thead>
                <tr className="border-b border-border-default text-left">
                  <th className="py-2 pr-4 font-medium text-heading">Spec</th>
                  <th className="py-2 font-medium text-heading">Supported</th>
                </tr>
              </thead>
              <tbody>
                {specs.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-border-default-subtle last:border-0"
                  >
                    <td className="py-2.5 pr-4 text-body-subtle">{row.label}</td>
                    <td className="py-2.5 font-mono text-[13px] text-heading">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WindowPanel>
      </Container>
    </section>
  );
}
