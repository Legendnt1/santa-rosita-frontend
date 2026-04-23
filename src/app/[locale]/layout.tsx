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
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Preload critical fonts — regular + semibold cover the bulk of UI text */}
        <link
          rel="preload"
          href="/assets/fonts/rubik-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/fonts/rubik-semibold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Inline script to prevent flash of wrong theme (FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');else if(t==='light')document.documentElement.classList.add('light')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
