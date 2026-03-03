import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import '../globals.css';

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
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

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
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
