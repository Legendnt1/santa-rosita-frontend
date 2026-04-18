import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { Navbar } from "@/shared/ui/components/Navbar";
import { CartView } from "@/shared/ui/components/CartView";

interface CartPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <Navbar dict={dict} locale={locale} />
      <main>
        <CartView locale={locale} labels={dict.cart} />
      </main>
    </>
  );
}
