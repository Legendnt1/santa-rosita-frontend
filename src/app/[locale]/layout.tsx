import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Rubik } from 'next/font/google';
import { cookies } from 'next/headers';
import { locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { Footer } from '@/shared/ui/components/Footer';
import { Navbar } from '@/shared/ui/components/Navbar';
import '../globals.css';

/**
 * Rubik variable font, self-hosted by Next.js via `next/font/google`.
 * Covers every weight the UI consumes (400–800). The `--font-rubik` CSS
 * variable is wired to Tailwind's `--font-sans` token in globals.css.
 */
const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-rubik',
  display: 'swap',
});

/**
 * Pre-generates routes for every supported locale at build time.
 * Required for the `[locale]` dynamic segment.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Generates locale-aware metadata using the i18n dictionary.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

/**
 * Root layout for all `[locale]` routes.
 * Sets the HTML `lang` attribute and applies global styles.
 *
 * @remarks
 * This layout wraps `<html>` and `<body>` because it is the
 * top-level layout for every locale-specific route.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // Read the theme cookie server-side so the correct class is applied to
  // <html> on the very first byte — no inline script, no FOUC.
  // Falls back to an empty string (no forced class) on first visit;
  // globals.css `prefers-color-scheme` media query then picks the palette.
  const jar = await cookies();
  const themeCookie = jar.get('theme')?.value;
  const themeClass = themeCookie === 'dark' ? 'dark' : themeCookie === 'light' ? 'light' : '';

  return (
    <html
      lang={locale}
      className={[rubik.variable, themeClass].filter(Boolean).join(' ')}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <Navbar dict={dict} locale={locale} />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer locale={locale} dict={dict.footer} storeName={dict.pdp.storeName} />
      </body>
    </html>
  );
}
