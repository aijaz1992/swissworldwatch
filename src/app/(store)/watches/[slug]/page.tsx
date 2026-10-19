import { ProductDetailView } from "@/components/store/product-detail";
import { ProductListing } from "@/components/store/product-listing";
import { getProductBySlug, getRelatedProducts, parseFilters } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { getCurrency } from "@/lib/settings";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { slug: string };
type Search = Record<string, string | string[] | undefined>;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (product) {
    return { title: product.name, description: product.description };
  }
  const brand = await prisma.brand.findUnique({ where: { slug } });
  if (brand) return { title: `${brand.name} Watches`, description: brand.description };
  const category = await prisma.category.findUnique({ where: { slug } });
  if (category) return { title: category.name, description: category.description };
  return { title: "Watches" };
}

export default async function WatchSlugPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (product) {
    const [related, currency] = await Promise.all([
      getRelatedProducts(product),
      getCurrency(),
    ]);
    return <ProductDetailView product={product} related={related} currency={currency} />;
  }

  const brand = await prisma.brand.findUnique({ where: { slug } });
  if (brand) {
    const filters = parseFilters(await searchParams, { brand: brand.slug });
    return <ProductListing title={`${brand.name} Watches`} description={brand.description} filters={filters} />;
  }

  const category = await prisma.category.findUnique({ where: { slug } });
  if (category) {
    const filters = parseFilters(await searchParams, { category: category.slug });
    return <ProductListing title={category.name} description={category.description} filters={filters} />;
  }

  notFound();
}
