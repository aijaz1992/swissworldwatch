import { createBrand, createCategory, createCollection, deleteBrand, deleteCategory, deleteCollection } from "@/actions/admin";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { TaxonomyForm } from "@/components/admin/taxonomy-form";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const [brands, categories, collections] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } }),
    prisma.collection.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Categories</h1>
      <p className="mt-2 text-sm text-neutral-600">Brands and categories with watches cannot be deleted until those watches are moved.</p>
      {error === "in-use" && (
        <p className="mt-3 text-sm text-sale" role="alert">
          That brand or category still has watches. Move or delete those watches first.
        </p>
      )}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Brands">
          <ul className="space-y-2 text-sm">
            {brands.map((brand) => (
              <li key={brand.id} className="flex items-center justify-between gap-3 border-b border-neutral-100 py-2">
                <span>
                  {brand.name} <span className="text-neutral-400">({brand._count.products})</span>
                </span>
                <form action={deleteBrand}>
                  <input type="hidden" name="id" value={brand.id} />
                  <ConfirmButton label="Delete" message={`Delete ${brand.name}?`} className="text-sale" />
                </form>
              </li>
            ))}
          </ul>
          <TaxonomyForm action={createBrand} label="Brand name" featured />
        </Panel>
        <Panel title="Categories">
          <ul className="space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center justify-between gap-3 border-b border-neutral-100 py-2">
                <span>
                  {category.name} <span className="text-neutral-400">({category._count.products})</span>
                </span>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <ConfirmButton label="Delete" message={`Delete ${category.name}?`} className="text-sale" />
                </form>
              </li>
            ))}
          </ul>
          <TaxonomyForm action={createCategory} label="Category name" />
        </Panel>
        <Panel title="Collections">
          <ul className="space-y-2 text-sm">
            {collections.map((collection) => (
              <li key={collection.id} className="flex items-center justify-between gap-3 border-b border-neutral-100 py-2">
                <span>
                  {collection.name} <span className="text-neutral-400">({collection._count.products})</span>
                </span>
                <form action={deleteCollection}>
                  <input type="hidden" name="id" value={collection.id} />
                  <ConfirmButton label="Delete" message={`Delete ${collection.name}?`} className="text-sale" />
                </form>
              </li>
            ))}
          </ul>
          <TaxonomyForm action={createCollection} label="Collection name" />
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
