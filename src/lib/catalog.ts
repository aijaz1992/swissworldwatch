import { cached } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { Prisma, type Gender } from "@prisma/client";

export const productCardInclude = {
  brand: { select: { id: true, name: true, slug: true } },
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
} satisfies Prisma.ProductInclude;

export type ProductCardData = Prisma.ProductGetPayload<{ include: typeof productCardInclude }>;

const productDetailInclude = {
  brand: true,
  category: true,
  collection: true,
  images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
  specs: { orderBy: { sortOrder: "asc" } },
} satisfies Prisma.ProductInclude;

export type ProductDetail = Prisma.ProductGetPayload<{ include: typeof productDetailInclude }>;

export type CatalogFilters = {
  q?: string;
  brand?: string;
  category?: string;
  gender?: Gender;
  min?: number;
  max?: number;
  sort: "newest" | "price-asc" | "price-desc" | "name";
  availability?: "in" | "out";
  sale: boolean;
  movement?: string;
  hub?: string;
  page: number;
};

type RawParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
}

export function parseFilters(params: RawParams, locked: Partial<CatalogFilters> = {}): CatalogFilters {
  const genderRaw = one(params.gender);
  const gender = genderRaw === "MEN" || genderRaw === "WOMEN" || genderRaw === "UNISEX" ? genderRaw : undefined;
  const sortRaw = one(params.sort);
  const sort =
    sortRaw === "price-asc" || sortRaw === "price-desc" || sortRaw === "name" || sortRaw === "newest"
      ? sortRaw
      : "newest";
  const availabilityRaw = one(params.availability);
  const availability = availabilityRaw === "in" || availabilityRaw === "out" ? availabilityRaw : undefined;
  const min = Number(one(params.min));
  const max = Number(one(params.max));
  const page = Math.max(1, Number(one(params.page)) || 1);

  return {
    q: one(params.q),
    brand: locked.brand ?? one(params.brand),
    category: locked.category ?? one(params.category),
    gender: locked.gender ?? gender,
    min: Number.isFinite(min) && min > 0 ? min : undefined,
    max: Number.isFinite(max) && max > 0 ? max : undefined,
    sort,
    availability,
    sale: locked.sale ?? (one(params.sale) === "1" || one(params.sale) === "on"),
    movement: locked.movement ?? one(params.movement),
    hub: one(params.hub),
    page,
  };
}

export function filtersToQuery(filters: CatalogFilters, overrides: Partial<CatalogFilters> = {}) {
  const merged = { ...filters, ...overrides };
  const params = new URLSearchParams();
  if (merged.q) params.set("q", merged.q);
  if (merged.brand) params.set("brand", merged.brand);
  if (merged.category) params.set("category", merged.category);
  if (merged.gender) params.set("gender", merged.gender);
  if (merged.min) params.set("min", String(merged.min));
  if (merged.max) params.set("max", String(merged.max));
  if (merged.sort !== "newest") params.set("sort", merged.sort);
  if (merged.availability) params.set("availability", merged.availability);
  if (merged.sale) params.set("sale", "1");
  if (merged.movement) params.set("movement", merged.movement);
  if (merged.hub) params.set("hub", merged.hub);
  if (merged.page > 1) params.set("page", String(merged.page));
  const query = params.toString();
  return query ? `?${query}` : "";
}

const PAGE_SIZE = 12;

export const queryProducts = cached(async (filters: CatalogFilters) => {
  const where: Prisma.ProductWhereInput = { status: "ACTIVE" };
  let min = filters.min;
  let max = filters.max;
  if (min && max && min > max) [min, max] = [max, min];

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
      { sku: { contains: filters.q, mode: "insensitive" } },
      { brand: { name: { contains: filters.q, mode: "insensitive" } } },
      { dialColor: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  if (filters.brand) where.brand = { slug: filters.brand };
  if (filters.category) where.category = { slug: filters.category };
  if (filters.gender) where.gender = filters.gender;
  if (filters.movement) where.movement = { contains: filters.movement, mode: "insensitive" };
  if (filters.availability === "in") where.stock = { gt: 0 };
  if (filters.availability === "out") where.stock = { lte: 0 };
  if (filters.sale) where.compareAtPrice = { not: null };
  if (min || max) {
    where.price = {
      ...(min ? { gte: min } : {}),
      ...(max ? { lte: max } : {}),
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "price-asc"
      ? { price: "asc" }
      : filters.sort === "price-desc"
        ? { price: "desc" }
        : filters.sort === "name"
          ? { name: "asc" }
          : { createdAt: "desc" };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: productCardInclude,
      orderBy,
      skip: (filters.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return {
    products,
    total,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}, "query-products");

export const getProductBySlug = cached(
  (slug: string) =>
    prisma.product.findFirst({
      where: { slug, status: "ACTIVE" },
      include: productDetailInclude,
    }),
  "product-by-slug",
);

/** Resolves a /watches/[slug] URL to a brand or category (cached). */
export const getTaxonomyBySlug = cached(async (slug: string) => {
  const brand = await prisma.brand.findUnique({ where: { slug }, select: { name: true, slug: true, description: true } });
  if (brand) return { kind: "brand" as const, ...brand };
  const category = await prisma.category.findUnique({ where: { slug }, select: { name: true, slug: true, description: true } });
  if (category) return { kind: "category" as const, ...category };
  return null;
}, "taxonomy-by-slug");

/** Brand and category names for navigation and filters (cached). */
export const getNavTaxonomy = cached(async () => {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { sortOrder: "asc" }, select: { name: true, slug: true } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { name: true, slug: true } }),
  ]);
  return { brands, categories };
}, "nav-taxonomy");

export const getRelatedProducts = cached(async (product: { id: string; categoryId: string; brandId: string }) => {
  const related = await prisma.product.findMany({
    where: { status: "ACTIVE", id: { not: product.id }, categoryId: product.categoryId },
    include: productCardInclude,
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  if (related.length >= 4) return related;
  const more = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      id: { notIn: [product.id, ...related.map((item) => item.id)] },
      brandId: product.brandId,
    },
    include: productCardInclude,
    take: 4 - related.length,
  });
  return [...related, ...more];
}, "related-products");

export function primaryImage(product: { images: { url: string; isPrimary: boolean }[]; name?: string }) {
  return product.images.find((image) => image.isPrimary)?.url ?? product.images[0]?.url ?? null;
}

export function specRows(product: ProductDetail) {
  const rows = [
    ["Brand", product.brand.name],
    ["Category", product.category.name],
    ["Collection", product.collection?.name],
    ["SKU", product.sku],
    ["Movement", product.movement],
    ["Case material", product.caseMaterial],
    ["Strap / bracelet", product.strapMaterial],
    ["Dial", product.dialColor],
    ["Case size", product.caseSize],
    ["Water resistance", product.waterResistance],
    ["Gender", product.gender === "MEN" ? "Men" : product.gender === "WOMEN" ? "Women" : "Unisex"],
    ...product.specs.map((spec) => [spec.label, spec.value] as [string, string]),
  ];
  return rows.filter((row): row is [string, string] => Boolean(row[0] && row[1]));
}
