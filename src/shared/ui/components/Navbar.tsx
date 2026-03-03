import type { Dictionary } from '@/i18n/getDictionary';
import { SearchBar } from './SearchBar';

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
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          {/* Logo */}
          <a href={`/${locale}`} className="shrink-0" aria-label="Home">
            <img
              src="/assets/images/logo.webp"
              alt="Corporación Santa Rosita"
              className="h-14 w-auto"
            />
          </a>

          {/* Search */}
          <div className="flex-1">
            <SearchBar placeholder={dict.common.searchPlaceholder} />
          </div>

          {/* Action icons */}
          <nav className="flex items-center gap-4 text-navbar-fg">
            {/* Language indicator */}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
              aria-label="Change language"
            >
              <svg>
                <use href="/assets/icons/icons.svg#world" />
              </svg>
            </button>

            {/* Account */}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
              aria-label="Account"
            >
              <svg>
                <use href="/assets/icons/icons.svg#user" />
              </svg>
            </button>

            {/* Cart */}
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
              aria-label="Cart"
            >
              <svg>
                <use href="/assets/icons/icons.svg#shopping-cart" />
              </svg>
              {/* Badge */}
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                0
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* ── Sub-navigation ─────────────────────────────────── */}
      <nav className="border-t border-border bg-navbar-bg">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-2 text-sm font-medium text-navbar-fg">
          <a href="#" className="flex items-center gap-1 hover:text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {dict.navbar.categories}
          </a>
          <a href="#" className="hover:text-primary">
            {dict.navbar.newProducts}
          </a>
          <a href="#" className="hover:text-primary">
            {dict.navbar.discounts}
          </a>
        </div>
      </nav>
    </header>
  );
}
