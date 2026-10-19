import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, brands, categories, collections] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } }, specs: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.collection.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/products" className="text-sm text-sky">
        Back to products
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Edit watch</h1>
      <div className="mt-6 bg-white p-5 shadow-sm">
        <ProductForm
          brands={brands}
          categories={categories}
          collections={collections}
          product={{
            ...product,
            specs: product.specs.map((spec) => ({ label: spec.label, value: spec.value })),
            images: product.images.map((image) => ({ id: image.id, url: image.url, isPrimary: image.isPrimary })),
          }}
        />
      </div>
    </div>
  );
}
