import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function NewProductPage() {
  const [brands, categories, collections] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.collection.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/products" className="text-sm text-sky">
        Back to products
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Add watch</h1>
      <div className="mt-6 bg-white p-5 shadow-sm">
        <ProductForm brands={brands} categories={categories} collections={collections} />
      </div>
    </div>
  );
}
