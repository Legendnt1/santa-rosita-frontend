import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { RegisterForm } from "@/shared/ui/components/RegisterForm";

/**
 * Register page props, containing the locale parameter which is used to fetch the appropriate translations for the page.
 * The params are passed to the page component by Next.js based on the dynamic route configuration.
 */
interface RegisterPageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * Register page component that renders the registration form and handles user registration. 
 * It fetches the appropriate translations based on the locale and passes them to the RegisterForm component.
 * The page is designed to be simple and focused on user registration, with a logo and a card layout for the form.
 * The RegisterForm component is responsible for handling the form submission and calling the registerAction to perform the registration.
 */
export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.auth;

  return (
    <div className="w-full max-w-sm animate-fade-up">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <a href={`/${locale}`}>
          <img
            src="/assets/images/logo.webp"
            alt="Corporación Santa Rosita"
            className="h-14 w-auto"
          />
        </a>
      </div>

      {/* Card */}
      <div className="card p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-extrabold text-card-foreground sm:text-2xl">
            {t.registerTitle}
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">{t.registerSubtitle}</p>
        </div>

        <RegisterForm locale={locale} labels={t} />
      </div>
    </div>
  );
}
