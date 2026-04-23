"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth-store";
import { registerAction } from "@/app/[locale]/auth/actions";
import Link from "next/link";
import { Icon } from "./Icon";

/**
 * Register form props, containing the locale and labels for the form fields and buttons.
 */
interface RegisterFormProps {
  locale: string;
  labels: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    submitRegister: string;
    switchToLogin: string;
    togglePassword: string;
    placeholders: {
      name: string;
      email: string;
      password: string;
    };
    errors: {
      required: string;
      invalidEmail: string;
      passwordMismatch: string;
      emailTaken: string;
      unknown: string;
    };
  };
}

/**
 * Register form component that renders the registration form and handles user registration.
 * It manages local state for form fields, error messages, and loading state during the registration process.
 * The form includes fields for name, email, password, and confirm password, a submit button, and a link for switching to the login page.
 * Upon submission, it validates the input and calls the registerAction to perform registration. If successful, 
 * it updates the auth store and redirects the user; if there's an error, it displays an appropriate message.
 * The component also includes a toggle for showing/hiding the password and displays a loading spinner while the registration action is in progress.
 * It provides a user-friendly interface for new users to create an account on the platform.
 * The component is designed to be reusable and can be easily integrated into any page that requires user registration functionality.
 * The validation logic ensures that users provide valid input before attempting to register, improving the overall user experience and reducing unnecessary server requests.
 * Error handling is implemented to provide clear feedback to users in case of issues during registration, such as an already taken email or mismatched passwords.
 * The use of a loading spinner during the registration process gives users visual feedback that their request is being processed, 
 * enhancing the perceived performance of the application.
 */
export function RegisterForm({ locale, labels }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const validate = (): string | null => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim())
      return labels.errors.required;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return labels.errors.invalidEmail;
    if (password !== confirm) return labels.errors.passwordMismatch;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setIsPending(true);
    const result = await registerAction(name.trim(), email.trim(), password);
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
        <div className="alert-error">
          <Icon name="alert-triangle" className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-name" className="text-sm font-medium text-card-foreground">
          {labels.name}
        </label>
        <input
          id="reg-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          className="input-base w-full"
          placeholder={labels.placeholders.name}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-email" className="text-sm font-medium text-card-foreground">
          {labels.email}
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          className="input-base w-full"
          placeholder={labels.placeholders.email}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-password" className="text-sm font-medium text-card-foreground">
          {labels.password}
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            className="input-password"
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

      {/* Confirm password */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-confirm" className="text-sm font-medium text-card-foreground">
          {labels.confirmPassword}
        </label>
        <input
          id="reg-confirm"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={isPending}
          className="input-base w-full"
          placeholder={labels.placeholders.password}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary mt-1 flex items-center justify-center gap-2"
      >
        {isPending && (
          <span className="spinner-sm" />
        )}
        {labels.submitRegister}
      </button>

      {/* Switch link */}
      <p className="text-center text-sm text-foreground-muted">
        <Link
          href={`/${locale}/auth/login`}
          className="font-medium text-primary hover:underline"
        >
          {labels.switchToLogin}
        </Link>
      </p>
    </form>
  );
}
