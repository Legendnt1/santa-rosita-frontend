import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { LoginForm } from "@/shared/ui/components/LoginForm";

/**
 * Login page props, containing the locale parameter which is used to fetch the appropriate translations for the page.
 * The params are passed to the page component by Next.js based on the dynamic route configuration.
 */
interface LoginPageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * Login page component that renders the login form and handles user authentication. 
 * It fetches the appropriate translations based on the locale and passes them to the LoginForm component.
 * The page is designed to be simple and focused on user login, with a logo and a card layout for the form.
 * The LoginForm component is responsible for handling the form submission and calling the loginAction to perform the authentication.
 */
export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.auth;

  return (
    <div className="w-full max-w-sm animate-fade-in-up">
      <div className="card p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-extrabold text-card-foreground sm:text-2xl">
            {t.loginTitle}
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">{t.loginSubtitle}</p>
        </div>

        <LoginForm locale={locale} labels={t} />
      </div>
    </div>
  );
}
