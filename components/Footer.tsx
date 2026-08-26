import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="border-t border-rule bg-cream-2">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-ink-soft space-y-4">
        <p>
          {siteConfig.name} is a JPBA Investments, LLC company serving the{" "}
          {siteConfig.serviceArea}.
          {siteConfig.phone && <> Call or text {siteConfig.phone}.</>}
        </p>
        <p className="text-xs text-ink-mute">
          Equal Housing Opportunity. Pricing, down payment, and monthly payment terms shown are
          estimates and subject to change; contact us for full seller finance terms. This is not
          a bank, mortgage lender, or licensed mortgage originator.
        </p>
        <p className="text-xs text-ink-mute">
          &copy; {new Date().getFullYear()} JPBA Investments, LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
