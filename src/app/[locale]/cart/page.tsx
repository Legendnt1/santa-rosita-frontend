import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { CartView } from "@/shared/ui/components/CartView";

interface CartPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main>
      <CartView locale={locale} labels={dict.cart} />
    </main>
  );
}
