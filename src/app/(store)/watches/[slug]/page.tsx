import { ProductDetailView } from "@/components/store/product-detail";
import { ProductListing } from "@/components/store/product-listing";
import { getProductBySlug, getRelatedProducts, getTaxonomyBySlug, parseFilters } from "@/lib/catalog";
import { getCurrency } from "@/lib/settings";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { slug: string };
type Search = Record<string, string | string[] | undefined>;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (product) return { title: product.name, description: product.description };
  const taxonomy = await getTaxonomyBySlug(slug);
  if (taxonomy?.kind === "brand") return { title: `${taxonomy.name} Watches`, description: taxonomy.description };
  if (taxonomy) return { title: taxonomy.name, description: taxonomy.description };
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
      getRelatedProducts({ id: product.id, categoryId: product.categoryId, brandId: product.brandId }),
      getCurrency(),
    ]);
    return <ProductDetailView product={product} related={related} currency={currency} />;
  }

  const taxonomy = await getTaxonomyBySlug(slug);
  if (!taxonomy) notFound();

  const filters = parseFilters(await searchParams, taxonomy.kind === "brand" ? { brand: taxonomy.slug } : { category: taxonomy.slug });
  const title = taxonomy.kind === "brand" ? `${taxonomy.name} Watches` : taxonomy.name;
  return <ProductListing title={title} description={taxonomy.description} filters={filters} />;
}
