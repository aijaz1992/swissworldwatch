import { Footer, WhatsAppButton } from "@/components/store/footer";
import { Header } from "@/components/store/header";
import { getCurrentUser } from "@/lib/auth";
import { cartCount, getCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import { getCurrency, getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [settings, brands, categories, cart, user, currency] = await Promise.all([
    getSettings(),
    prisma.brand.findMany({ orderBy: { sortOrder: "asc" }, select: { name: true, slug: true } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { name: true, slug: true } }),
    getCart(),
    getCurrentUser(),
    getCurrency(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        promoText={settings.promoText}
        phone={settings.phone}
        hours={settings.hours}
        brands={brands}
        categories={categories}
        cartCount={cartCount(cart)}
        currency={currency}
        user={user ? { name: user.name, role: user.role } : null}
      />
      <main id="content" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} brands={brands} categories={categories} />
      <WhatsAppButton phone={settings.whatsapp} />
    </div>
  );
}
