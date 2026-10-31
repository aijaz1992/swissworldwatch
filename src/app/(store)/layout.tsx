import { Footer, WhatsAppButton } from "@/components/store/footer";
import { Header } from "@/components/store/header";
import { getCurrentUser } from "@/lib/auth";
import { cartCount, getCart } from "@/lib/cart";
import { getNavTaxonomy } from "@/lib/catalog";
import { getCurrency, getSettings } from "@/lib/settings";
import { safe } from "@/lib/safe";

// Header shows the visitor's cart, login and currency, so store pages render per request.
// Catalog data itself is cached (see src/lib/cache.ts), so each request stays cheap.
export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [settings, { brands, categories }, cart, user, currency] = await Promise.all([
    getSettings(),
    safe(getNavTaxonomy(), { brands: [], categories: [] }, "layout taxonomy"),
    safe(getCart(), null, "layout cart"),
    safe(getCurrentUser(), null, "layout user"),
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
      <Footer settings={settings} brands={brands.filter((brand) => brand.featured)} categories={categories} />
      <WhatsAppButton phone={settings.whatsapp} />
    </div>
  );
}
