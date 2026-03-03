import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from './i18n/config';

/**
 * Detects the user's preferred locale from the Accept-Language header.
 * Iterates through supported locales and returns the first match.
 * Falls back to the default locale when no match is found.
 *
 * @param request - The incoming Next.js request
 * @returns The best-matching supported locale
 */
function getPreferredLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const normalized = acceptLanguage.toLowerCase();

  for (const locale of locales) {
    if (normalized.includes(locale)) {
      return locale;
    }
  }

  return defaultLocale;
}

/**
 * Checks whether the pathname already contains a supported locale prefix.
 */
function pathnameHasLocale(pathname: string): boolean {
  return locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
}

/**
 * Next.js proxy for automatic locale detection and redirection.
 * Requests without a locale prefix are redirected to the user's
 * preferred locale (based on Accept-Language) or the default locale.
 */
export function proxy(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;

  if (pathnameHasLocale(pathname)) {
    return undefined;
  }

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

/** Matcher excludes internal Next.js routes, static assets, and API routes. */
export const config = {
  matcher: ['/((?!_next|assets|api|favicon\\.ico).*)'],
};
