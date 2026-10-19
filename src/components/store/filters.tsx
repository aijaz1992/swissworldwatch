"use client";

import type { CatalogFilters } from "@/lib/catalog";

export function Filters({
  brands,
  categories,
  filters,
}: {
  brands: { name: string; slug: string }[];
  categories: { name: string; slug: string }[];
  filters: CatalogFilters;
}) {
  return (
    <form
      action="/watches"
      method="get"
      className="space-y-5"
      onChange={(event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement && (target.type === "number" || target.type === "search")) return;
        event.currentTarget.requestSubmit();
      }}
    >
      {filters.movement && <input type="hidden" name="movement" value={filters.movement} />}
      {filters.hub && <input type="hidden" name="hub" value={filters.hub} />}
      <label className="block text-sm">
        <span className="mb-1 block font-semibold">Search</span>
        <input className="input" type="search" name="q" defaultValue={filters.q ?? ""} placeholder="Name, brand, SKU" />
      </label>
      <Select label="Sort" name="sort" defaultValue={filters.sort}>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="name">Name</option>
      </Select>
      <Select label="Gender" name="gender" defaultValue={filters.gender ?? ""}>
        <option value="">All</option>
        <option value="MEN">Men</option>
        <option value="WOMEN">Women</option>
        <option value="UNISEX">Unisex</option>
      </Select>
      <Select label="Brand" name="brand" defaultValue={filters.brand ?? ""}>
        <option value="">All brands</option>
        {brands.map((brand) => (
          <option key={brand.slug} value={brand.slug}>
            {brand.name}
          </option>
        ))}
      </Select>
      <Select label="Category" name="category" defaultValue={filters.category ?? ""}>
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </Select>
      <fieldset>
        <legend className="mb-1 text-sm font-semibold">Price (INR)</legend>
        <div className="grid grid-cols-2 gap-2">
          <input className="input" type="number" min={0} name="min" placeholder="Min" defaultValue={filters.min ?? ""} />
          <input className="input" type="number" min={0} name="max" placeholder="Max" defaultValue={filters.max ?? ""} />
        </div>
      </fieldset>
      <Select label="Availability" name="availability" defaultValue={filters.availability ?? ""}>
        <option value="">Any</option>
        <option value="in">In stock</option>
        <option value="out">Out of stock</option>
      </Select>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="sale" value="1" defaultChecked={filters.sale} />
        On sale
      </label>
      <button className="btn-sky w-full" type="submit">
        Apply filters
      </button>
    </form>
  );
}

function Select({
  label,
  name,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  defaultValue: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold">{label}</span>
      <select className="input" name={name} defaultValue={defaultValue}>
        {children}
      </select>
    </label>
  );
}
