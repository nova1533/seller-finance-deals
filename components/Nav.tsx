import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Nav() {
  return (
    <header className="border-b border-rule bg-cream/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-3 sm:py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={253}
            height={72}
            priority
            className="h-14 w-auto sm:h-[72px]"
          />
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium whitespace-nowrap text-ink-soft">
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
