"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth-store";
import { loginAction } from "@/app/[locale]/auth/actions";
import { Icon } from "./Icon";

/**
 * Login form props, containing the locale and labels for the form fields and buttons.
 * The locale is used for routing after successful login, while the labels provide the necessary text for the form fields, buttons, and error messages.
 * This component is responsible for rendering the login form, handling user input, validating the form, and performing the login action when the form is submitted.
 * It also manages the local state for form fields, error messages, and loading state during the login process.
 */
interface LoginFormProps {
  locale: string;
  labels: {
    email: string;
    password: string;
    submit: string;
    forgotPassword: string;
    switchToRegister: string;
    togglePassword: string;
    placeholders: {
      email: string;
      password: string;
    };
    errors: {
      required: string;
      invalidEmail: string;
      invalidCredentials: string;
      unknown: string;
    };
  };
}

/**
 * Login form component that renders the login form and handles user authentication.
 * It manages local state for form fields, error messages, and loading state during the login process.
 * The form includes fields for email and password, a submit button, and links for forgot password and switching to the registration page.
 * Upon submission, it validates the input and calls the loginAction to perform authentication. If successful, 
 * it updates the auth store and redirects the user; if there's an error, it displays an appropriate message.
 * The component also includes a toggle for showing/hiding the password and displays a loading spinner while the login action is in progress.
 */
export function LoginForm({ locale, labels }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const validate = (): string | null => {
    if (!email.trim() || !password.trim()) return labels.errors.required;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return labels.errors.invalidEmail;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setIsPending(true);
    const result = await loginAction(email.trim(), password);
    setIsPending(false);

    if (result.error) {
      const key = result.error.split(".").pop() as keyof typeof labels.errors;
      setError(labels.errors[key] ?? labels.errors.unknown);
      return;
    }

    if (result.user) setUser(result.user);
    router.push(`/${locale}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2.5 text-sm text-accent animate-fade-in">
          <Icon name="alert-triangle" className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-email" className="text-sm font-medium text-card-foreground">
          {labels.email}
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
          placeholder={labels.placeholders.email}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="text-sm font-medium text-card-foreground">
            {labels.password}
          </label>
          <button
            type="button"
            className="text-xs text-foreground-muted hover:text-primary transition-colors"
          >
            {labels.forgotPassword}
          </button>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-foreground-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            placeholder={labels.placeholders.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
            aria-label={labels.togglePassword}
            aria-pressed={showPassword}
          >
            <Icon name={showPassword ? "moon" : "sun"} className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary mt-1 flex items-center justify-center gap-2"
      >
        {isPending && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
        )}
        {labels.submit}
      </button>

      {/* Switch link */}
      <p className="text-center text-sm text-foreground-muted">
        <a
          href={`/${locale}/auth/register`}
          className="font-medium text-primary hover:underline"
        >
          {labels.switchToRegister}
        </a>
      </p>
    </form>
  );
}
