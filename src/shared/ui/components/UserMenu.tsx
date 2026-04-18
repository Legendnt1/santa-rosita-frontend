"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth-store";
import { logoutAction } from "@/app/[locale]/auth/actions";
import type { User } from "@/modules/auth/domain/entities/User";
import { Icon } from "./Icon";

/**
 * User menu props, containing the initial user resolved server-side from the JWT cookie (null if not logged in), the locale for routing, and labels for the menu actions.
 */
interface UserMenuProps {
  /** User resolved server-side from the JWT cookie (null if not logged in). */
  initialUser: User | null;
  locale: string;
  labels: {
    signIn: string;
    signUp: string;
    logout: string;
  };
}

/**
 * User menu component that displays the user's name and a dropdown menu with user actions when logged in, or login/register links when logged out.
 * It manages the open/close state of the dropdown menu and handles user logout by calling the logoutAction and updating the auth store.
 * The component also listens for clicks outside of the menu to automatically close it when the user clicks elsewhere on the page.
 * When the user is logged in, it displays their name and a dropdown with a logout option. When logged out, it shows links to the login and registration pages.
 * The component is designed to provide a seamless user experience for authentication-related actions in the application's navigation bar or header.
 */
export function UserMenu({ initialUser, locale, labels }: UserMenuProps) {
  const storeUser = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Server-read user (cookie) takes precedence; store user hydrates after client login.
  const user = storeUser ?? initialUser;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    clearUser();
    setIsOpen(false);
    router.refresh();
  };

  /* ── Logged OUT ─────────────────────────────────────────── */
  if (!user) {
    return (
      <div className="flex items-center gap-1">
        <a
          href={`/${locale}/auth/login`}
          className="btn-icon text-xs font-semibold"
          aria-label={labels.signIn}
        >
          <Icon name="user" className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
        </a>
        <a
          href={`/${locale}/auth/register`}
          className="hidden rounded-full border border-primary/60 px-3 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground sm:block"
        >
          {labels.signUp}
        </a>
      </div>
    );
  }

  /* ── Logged IN ──────────────────────────────────────────── */
  const firstName = user.name.split(" ")[0];

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full px-2 py-1 text-navbar-fg transition-all hover:bg-primary/15 active:scale-95"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-24 truncate text-xs font-semibold sm:block">
          {firstName}
        </span>
        <Icon
          name="caret-down"
          className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="animate-scale-in absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border/60 bg-card shadow-lg shadow-black/10">
          {/* User info */}
          <div className="border-b border-border/40 px-4 py-3">
            <p className="truncate text-sm font-semibold text-card-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-foreground-muted">{user.email}</p>
          </div>

          {/* Actions */}
          <div className="p-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground-muted transition-colors hover:bg-accent/10 hover:text-accent"
            >
              <Icon name="x" className="h-4 w-4" />
              {labels.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
