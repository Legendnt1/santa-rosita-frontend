import Link from "next/link";
import type { Dictionary } from "@/i18n/getDictionary";
import { Icon, type IconName } from "./Icon";

interface FooterProps {
  /** Current locale segment used to build internal legal links. */
  locale: string;
  /** Footer slice of the i18n dictionary. */
  dict: Dictionary["footer"];
  /** Localized store name pulled from `dict.pdp.storeName`. */
  storeName: string;
}

/**
 * Social channel metadata. URLs are placeholders wired to the brand
 * profiles — swap for the real handles when marketing provides them.
 */
const SOCIAL_LINKS: ReadonlyArray<{
  id: keyof Dictionary["footer"]["social"];
  icon: IconName;
  href: string;
}> = [
  { id: "facebook", icon: "brand-facebook", href: "https://facebook.com" },
  { id: "instagram", icon: "brand-instagram", href: "https://instagram.com" },
  { id: "whatsapp", icon: "brand-whatsapp", href: "https://wa.me/" },
  { id: "twitter", icon: "brand-x-twitter", href: "https://x.com" },
];

/**
 * Site-wide footer with three columns (brand tagline, legal links, contact +
 * social) plus a bottom bar for the copyright line.
 *
 * @remarks
 * React 19 Server Component — renders zero client JS. Internal legal links
 * use `next/link`; social links use native anchors since they point to
 * external origins. The copyright year is resolved server-side, so it stays
 * correct without a hydration boundary.
 */
export function Footer({ locale, dict, storeName }: FooterProps) {
  const year = new Date().getFullYear();
  const rights = dict.rights.replace("{year}", String(year));

  return (
    <footer className="mt-12 border-t border-border/60 bg-navbar-bg text-navbar-fg">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-3">
        {/* ── Brand ─────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <p className="text-lg font-extrabold tracking-tight">{storeName}</p>
          <p className="max-w-xs text-sm leading-relaxed text-navbar-fg/70">
            {dict.tagline}
          </p>
        </div>

        {/* ── Legal ─────────────────────────────────────── */}
        <nav aria-label={dict.legalHeading} className="flex flex-col gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navbar-fg/60">
            {dict.legalHeading}
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link
                href={`/${locale}/legal/privacy`}
                className="text-navbar-fg/85 transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                {dict.privacy}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/legal/terms`}
                className="text-navbar-fg/85 transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                {dict.terms}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/legal/data-protection`}
                className="text-navbar-fg/85 transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                {dict.dataProtection}
              </Link>
            </li>
          </ul>
        </nav>

        {/* ── Contact + Social ─────────────────────────── */}
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navbar-fg/60">
            {dict.contactHeading}
          </p>
          <a
            href="mailto:contacto@santarosita.pe"
            className="inline-flex items-center gap-2 text-sm text-navbar-fg/85 transition-colors hover:text-primary"
          >
            <Icon name="mail" className="h-4 w-4" aria-hidden />
            contacto@santarosita.pe
          </a>
          <a
            href="tel:+5115550100"
            className="inline-flex items-center gap-2 text-sm text-navbar-fg/85 transition-colors hover:text-primary"
          >
            <Icon name="phone" className="h-4 w-4" aria-hidden />
            +51 1 555-0100
          </a>

          <div className="mt-1 flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navbar-fg/60">
              {dict.followUs}
            </p>
            <ul className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ id, icon, href }) => (
                <li key={id}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={dict.social[id]}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-navbar-fg/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    <Icon name={icon} className="h-4 w-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────── */}
      <div className="border-t border-border/40">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-navbar-fg/60 sm:px-6">
          {rights}
        </div>
      </div>
    </footer>
  );
}
