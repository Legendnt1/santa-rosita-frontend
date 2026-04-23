"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { locales, type Locale } from "@/i18n/config";
import { Icon } from "./Icon";

/**
 * Human-readable labels and flag emojis for each supported locale.
 */
const LOCALE_META: Record<Locale, { label: string; flag: string }> = {
  es: { label: "Español", flag: "🇪🇸" },
  en: { label: "English", flag: "🇺🇸" },
  zh: { label: "中文", flag: "🇨🇳" },
};

/**
 * Client-side language switcher with a dropdown menu.
 * Displays available locales when clicked, allowing
 * the user to pick any language in one click.
 *
 * @remarks
 * Replaces only the locale segment of the current pathname,
 * preserving nested routes. Closes on outside click or Escape.
 */
export function LanguageSwitcher({ locale, labels }: { locale: string; labels: { changeLanguage: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /** Reset open state when page is restored from bfcache — otherwise a stale
   *  dropdown can appear open without working click listeners. */
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setOpen(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  /** Close on outside click */
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const currentMeta = LOCALE_META[locale as Locale];

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="btn-icon"
        aria-label={labels.changeLanguage}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Icon name="world" className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className="animate-scale-in absolute right-0 top-full z-50 mt-2 min-w-36 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
          role="menu"
        >
          {locales.map((loc) => {
            const meta = LOCALE_META[loc];
            const isActive = loc === locale;
            const newPath = pathname.replace(`/${locale}`, `/${loc}`);

            return (
              <Link
                key={loc}
                href={newPath}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-card-foreground hover:bg-primary/5"
                }`}
              >
                <span className="text-base leading-none">{meta.flag}</span>
                <span>{meta.label}</span>
                {isActive && (
                  <span className="ml-auto text-xs text-primary/70">✓</span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
