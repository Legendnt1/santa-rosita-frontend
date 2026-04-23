import type { Dictionary } from "@/i18n/getDictionary";
import { getAuthToken } from "@/shared/lib/auth";
import { authRepository } from "@/modules/auth/infrastructure/auth-repository.instance";
import { catalogRepository } from "@/modules/catalog/infrastructure/catalog-repository.instance";
import type { User } from "@/modules/auth/domain/entities/User";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CartButton } from "./CartButton";
import { UserMenu } from "./UserMenu";
import { CategoriesNav } from "./CategoriesDropdown";

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
export async function Navbar({ dict, locale }: NavbarProps) {
  // Resolve current user server-side from the httpOnly JWT cookie.
  let currentUser: User | null = null;
  try {
    const token = await getAuthToken();
    if (token) currentUser = await authRepository.getProfile(token);
  } catch {
    currentUser = null;
  }

  const [categories, brands] = await Promise.all([
    catalogRepository.getCategories(),
    catalogRepository.getAllBrands(),
  ]);

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

            {/* User menu — shows sign in/up or logged-in user with dropdown */}
            <UserMenu
              initialUser={currentUser}
              locale={locale}
              labels={{
                signIn: dict.auth.signIn,
                signUp: dict.auth.signUp,
                logout: dict.auth.logout,
              }}
            />

            {/* Cart */}
            <CartButton locale={locale} label="Cart" />
          </nav>

          {/* Search — full width below logo on mobile, inline on desktop */}
          <div className="order-3 w-full md:order-2 md:flex-1">
            <SearchBar
              placeholder={dict.common.searchPlaceholder}
              locale={locale}
              submitLabel={dict.common.searchPlaceholder}
            />
          </div>
        </div>
      </div>

      {/* ── Sub-navigation ─────────────────────────────────── */}
      <CategoriesNav
        categories={categories}
        catalog={dict.catalog}
        brands={brands}
        locale={locale}
        labels={{
          categories: dict.navbar.categories,
          newProducts: dict.navbar.newProducts,
          discounts: dict.navbar.discounts,
          brands: dict.navbar.brands,
          seeAll: dict.navbar.seeAll,
          groupLabels: {
            purple: dict.navbar.groupPurple,
            earth: dict.navbar.groupEarth,
            sky: dict.navbar.groupSky,
            forest: dict.navbar.groupForest,
          },
        }}
      />
    </header>
  );
}
