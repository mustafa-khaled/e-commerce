import { Container } from "@/components/ui/Container";
import Link from "next/link";

const shopLinks = [
  "Keyboards",
  "Switches",
  "Keycaps",
  "Desk Mats",
  "Group Buys",
];

const supportLinks = [
  "Help Center",
  "Shipping",
  "Returns",
  "Build Guides",
  "Contact",
];

export function StoreFooter() {
  return (
    <footer className="border-t border-border-default bg-menu-bar pb-8 pt-10">
      <Container>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-serif text-xl text-heading">KeyVault.exe</p>
            <p className="mt-2 text-sm text-body">
              Mechanical keyboards, switches, and keycaps — served from a retro
              desktop you will want to click.
            </p>
          </div>

          <div>
            <h2 className="font-sans text-sm font-semibold text-heading">
              Shop
            </h2>
            <ul className="mt-3 space-y-2">
              {shopLinks.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-body no-underline hover:text-heading"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-sans text-sm font-semibold text-heading">
              Support
            </h2>
            <ul className="mt-3 space-y-2">
              {supportLinks.map((item) => (
                <li key={item}>
                  <Link
                    href="#support"
                    className="text-sm text-body no-underline hover:text-heading"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-sans text-sm font-semibold text-heading">
              Payment &amp; trust
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Visa", "MC", "Amex", "PayPal", "Apple Pay"].map((method) => (
                <span
                  key={method}
                  className="rounded-[var(--radius-base)] border border-border-default bg-neutral-primary-soft px-2 py-1 font-mono text-[11px] text-body-subtle"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border-default pt-6 text-xs text-body-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} KeyVault. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="no-underline hover:text-heading">
              Privacy
            </Link>
            <Link href="#" className="no-underline hover:text-heading">
              Terms
            </Link>
            <Link href="#" className="no-underline hover:text-heading">
              Cookies
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
