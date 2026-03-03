import type { Dictionary } from "@/i18n/getDictionary";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

/**
 * Props for the Navbar server component.
 */
interface NavbarProps {
  /** Complete dictionary for the current locale */
  dict: Dictionary;
  /** Current locale code, used for the language indicator */
  locale: string;
}

/**
 * Top navigation bar matching the mockup layout:
 * Logo | Search bar | Action icons | Sub-navigation links.
 * React 19 Server Component.
 */
export function Navbar({ dict, locale }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* ── Upper bar ──────────────────────────────────────── */}
      <div className="bg-navbar-bg">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-3 py-2 sm:px-4 sm:py-3 md:flex-nowrap md:gap-6">
          {/* Logo */}
          <a href={`/${locale}`} className="shrink-0" aria-label="Home">
            <img
              src="/assets/images/logo.webp"
              alt="Corporación Santa Rosita"
              className="h-10 w-auto sm:h-14"
            />
          </a>

          {/* Action icons — placed after logo on mobile, end on desktop */}
          <nav className="order-2 ml-auto flex items-center gap-1 sm:gap-2 md:order-3 md:ml-0">
            {/* Language switcher (client component) */}
            <LanguageSwitcher locale={locale} />

            {/* Theme toggle (client component) */}
            <ThemeToggle />

            {/* Account */}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-navbar-fg transition-all duration-200 hover:bg-primary/15 hover:scale-110 active:scale-95 sm:h-9 sm:w-9"
              aria-label="Account"
            >
              <svg className="h-5 w-5 sm:h-5.5 sm:w-5.5" aria-hidden="true">
                <use href="/assets/icons/icons.svg#user" />
              </svg>
            </button>

            {/* Cart */}
            <button
              type="button"
              className="relative flex h-8 w-8 items-center justify-center rounded-full text-navbar-fg transition-all duration-200 hover:bg-primary/15 hover:scale-110 active:scale-95 sm:h-9 sm:w-9"
              aria-label="Cart"
            >
              <svg className="h-5 w-5 sm:h-5.5 sm:w-5.5" aria-hidden="true">
                <use href="/assets/icons/icons.svg#shopping-cart" />
              </svg>
              {/* Badge */}
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                0
              </span>
            </button>
          </nav>

          {/* Search — full width below logo on mobile, inline on desktop */}
          <div className="order-3 w-full md:order-2 md:flex-1">
            <SearchBar placeholder={dict.common.searchPlaceholder} />
          </div>
        </div>
      </div>

      {/* ── Sub-navigation ─────────────────────────────────── */}
      <nav className="border-t border-border bg-navbar-sub-bg overflow-x-auto">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-3 py-2 text-xs font-medium text-navbar-fg whitespace-nowrap sm:gap-6 sm:px-4 sm:text-sm">
          <a href="#" className="flex items-center gap-1 transition-colors hover:text-primary">
            <svg className="h-4 w-4 sm:h-4.5 sm:w-4.5" aria-hidden="true">
              <use href="/assets/icons/icons.svg#menu-2" />
            </svg>
            {dict.navbar.categories}
          </a>
          <a href="#" className="transition-colors hover:text-primary">
            {dict.navbar.newProducts}
          </a>
          <a href="#" className="transition-colors hover:text-primary">
            {dict.navbar.discounts}
          </a>
        </div>
      </nav>
    </header>
  );
}
