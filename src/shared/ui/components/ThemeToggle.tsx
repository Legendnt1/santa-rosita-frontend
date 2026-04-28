"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

/** Name shared with the server-side cookie read in layout.tsx */
const THEME_COOKIE = "theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/** Reads the theme cookie from document.cookie (client-side only). */
function readThemeCookie(): "light" | "dark" | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)theme=(light|dark)/);
  return (match?.[1] as "light" | "dark") ?? null;
}

/** Persists theme to both cookie (for SSR) and localStorage (legacy fallback). */
function persistTheme(value: "light" | "dark") {
  document.cookie = `${THEME_COOKIE}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  localStorage.setItem(THEME_COOKIE, value);
}

/**
 * Client-side theme toggle button.
 *
 * The selected theme is persisted in a cookie so the server can read it on
 * every request and apply the correct class to `<html>` before the first
 * paint — eliminating FOUC without any inline script.
 *
 * On first visit (no cookie) the server renders with no forced class and
 * the browser's own `prefers-color-scheme` media query picks the palette
 * (already handled in globals.css). Once the user toggles, the cookie is
 * set and subsequent SSR renders are theme-aware immediately.
 */
interface ThemeToggleProps {
  /** Theme resolved server-side from the cookie. Used as the initial state so
   *  the icon and aria-label match the SSR-applied html class on first paint —
   *  no hydration flicker between the moon and sun glyphs. */
  initialTheme: "light" | "dark";
  labels: {
    lightMode: string;
    darkMode: string;
  };
}

export function ThemeToggle({ initialTheme, labels }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);

  /* On first-visit (no cookie sent to server) the server falls back to "light"
     while CSS may still resolve dark via `prefers-color-scheme`. Sync once
     after hydration so the icon matches what the user actually sees. */
  useEffect(() => {
    if (readThemeCookie()) return; // server already had ground truth
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";

    // Apply immediately to <html> — server already has the right class from
    // the cookie, so this only runs when the user explicitly toggles.
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    root.classList.toggle("light", next === "light");

    persistTheme(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-icon"
      aria-label={theme === "dark" ? labels.lightMode : labels.darkMode}
    >
      {theme === "dark" ? (
        <Icon name="sun" className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
      ) : (
        <Icon name="moon" className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
      )}
    </button>
  );
}
