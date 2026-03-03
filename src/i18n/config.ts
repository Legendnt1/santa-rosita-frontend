/**
 * Internationalization configuration.
 * Defines supported locales and the default fallback.
 */

/** Supported locale codes */
export const locales = ['es', 'en', 'zh'] as const;

/** Type representing a valid locale */
export type Locale = (typeof locales)[number];

/** Default locale used when no preference is detected */
export const defaultLocale: Locale = 'es';

/**
 * Checks whether the given string is a supported locale.
 * Acts as a type guard for the Locale type.
 */
export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
