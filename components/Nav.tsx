import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Nav() {
  return (
    <header className="border-b border-rule bg-cream/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl text-forest-deep">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-ink-soft">
          <Link href="/#available" className="hover:text-forest-deep">
            Available Homes
          </Link>
          <Link href="/#how-it-works" className="hover:text-forest-deep">
            How It Works
          </Link>
          {siteConfig.phone && (
            <a
              href={`tel:${siteConfig.phone}`}
              className="rounded-full bg-forest px-4 py-2 text-cream hover:bg-forest-deep"
            >
              {siteConfig.phone}
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
