import { Filters } from "@/components/store/filters";
import { ProductGrid } from "@/components/store/product-card";
import { filtersToQuery, getNavTaxonomy, queryProducts, type CatalogFilters } from "@/lib/catalog";
import Link from "next/link";

export async function ProductListing({
  title,
  description,
  filters,
}: {
  title: string;
  description?: string;
  filters: CatalogFilters;
}) {
  const [{ products, total, pageCount }, nav] = await Promise.all([queryProducts(filters), getNavTaxonomy()]);
  const brands = [...nav.brands].sort((a, b) => a.name.localeCompare(b.name));
  const categories = nav.categories;
  const clearable = Boolean(
    filters.q || filters.brand || filters.category || filters.collection || filters.gender || filters.min || filters.max || filters.availability || filters.sale || filters.movement,
  );

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{title}</h1>
        {filters.hub && <p className="mt-2 text-sm text-neutral-600">Delivery available in {filters.hub}.</p>}
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">{description}</p>}
        <p className="mt-2 text-sm text-neutral-500">
          {total} {total === 1 ? "watch" : "watches"}
        </p>
      </header>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <div>
          <details className="border border-neutral-200 p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold">Filter and sort</summary>
            <div className="mt-4">
              <Filters brands={brands} categories={categories} filters={filters} />
            </div>
          </details>
          <div className="hidden lg:block">
            <Filters brands={brands} categories={categories} filters={filters} />
          </div>
        </div>
        <div>
          {clearable && (
            <div className="mb-4 flex flex-wrap gap-2 text-xs">
              {filters.movement && <Chip href={filtersToQuery(filters, { movement: undefined, page: 1 })}>Movement: {filters.movement}</Chip>}
              {filters.sale && <Chip href={filtersToQuery(filters, { sale: false, page: 1 })}>On sale</Chip>}
              <Link href="/watches" className="text-sky hover:underline">
                Clear all
              </Link>
            </div>
          )}
          {total === 0 && (filters.brand || filters.collection) && !filters.q ? (
            <div className="border border-dashed border-[#d4b06a]/60 bg-[#0b1b33]/[0.03] px-6 py-16 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a8843f]">Coming soon</p>
              <p className="mt-3 text-lg font-semibold text-neutral-900">New pieces are arriving shortly</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
                We are adding watches to this collection. Message us on WhatsApp for current availability, or browse our full range.
              </p>
              <Link href="/watches" className="btn-sky mt-5">
                Browse all watches
              </Link>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
          {pageCount > 1 && (
            <nav className="mt-10 flex justify-center gap-2" aria-label="Pagination">
              {Array.from({ length: pageCount }, (_, index) => {
                const page = index + 1;
                const href = `/watches${filtersToQuery(filters, { page })}`;
                const current = page === filters.page;
                return (
                  <Link
                    key={page}
                    href={href}
                    aria-current={current ? "page" : undefined}
                    className={`grid h-9 w-9 place-items-center border text-sm ${current ? "border-sky bg-sky text-white" : "border-neutral-300 hover:border-sky"}`}
                  >
                    {page}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={`/watches${href}`} className="border border-neutral-300 px-2 py-1 hover:border-sky">
      {children} ×
    </Link>
  );
}
