import { ProductListing } from "@/components/store/product-listing";
import { parseFilters } from "@/lib/catalog";
import { SWISS_ETA_COLLECTION, navBrandName } from "@/lib/nav-menu";
import type { Metadata } from "next";

function menuTitle(filters: ReturnType<typeof parseFilters>) {
  const brand = navBrandName(filters.brand);
  if (filters.collection === SWISS_ETA_COLLECTION) return brand ? `${brand} Swiss ETA Watches` : "Swiss ETA Watches";
  if (brand && filters.gender === "MEN") return `${brand} Men's Watches`;
  if (brand && filters.gender === "WOMEN") return `${brand} Women's Watches`;
  if (brand) return `${brand} Watches`;
  return undefined;
}

type Params = Record<string, string | string[] | undefined>;

export async function generateMetadata({ searchParams }: { searchParams: Promise<Params> }): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  if (filters.q) return { title: `Search: ${filters.q}` };
  const menu = menuTitle(filters);
  if (menu) return { title: menu };
  if (filters.sale) return { title: "Sale" };
  if (filters.gender === "MEN") return { title: "Men's Watches" };
  if (filters.gender === "WOMEN") return { title: "Women's Watches" };
  if (filters.movement) return { title: "Swiss Automatic Watches" };
  return { title: "Watches" };
}

export default async function WatchesPage({ searchParams }: { searchParams: Promise<Params> }) {
  const filters = parseFilters(await searchParams);
  const menu = menuTitle(filters);
  const title = filters.q
    ? `Results for “${filters.q}”`
    : menu
      ? menu
      : filters.sale
      ? "Sale / Offers"
      : filters.gender === "MEN"
        ? "Men's Watches"
        : filters.gender === "WOMEN"
          ? "Women's Watches"
          : filters.movement
            ? "Swiss Automatic Watches"
            : filters.hub
              ? `Watches in ${filters.hub}`
              : "Watches";

  return <ProductListing title={title} filters={filters} description="Every watch on this page is loaded from the catalog." />;
}
