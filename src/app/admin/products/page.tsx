import { deleteProduct } from "@/actions/admin";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { primaryImage } from "@/lib/catalog";
import { formatDate, formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();
  const products = await prisma.product.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { sku: { contains: query, mode: "insensitive" } },
            { brand: { name: { contains: query, mode: "insensitive" } } },
          ],
        }
      : undefined,
    include: { brand: true, images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="btn-sky">
          Add watch
        </Link>
      </div>
      <form className="mt-4 flex gap-2" action="/admin/products">
        <input className="input max-w-sm" name="q" defaultValue={query} placeholder="Search name, brand, SKU" />
        <button className="border border-neutral-300 bg-white px-4 text-sm">Search</button>
      </form>
      <div className="mt-4 overflow-x-auto bg-white shadow-sm">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-3 py-3 font-medium">Image</th>
              <th className="px-3 py-3 font-medium">Product</th>
              <th className="px-3 py-3 font-medium">Brand</th>
              <th className="px-3 py-3 font-medium">Price</th>
              <th className="px-3 py-3 font-medium">Stock</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Created</th>
              <th className="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-neutral-500">
                  No watches yet.
                </td>
              </tr>
            )}
            {products.map((product) => {
              const image = primaryImage(product);
              return (
                <tr key={product.id} className="border-t border-neutral-100">
                  <td className="px-3 py-3">
                    <span className="relative block h-12 w-12 overflow-hidden bg-neutral-100">
                      {image && <Image src={image} alt="" fill className="object-cover" sizes="48px" />}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-neutral-500">{product.sku}</p>
                  </td>
                  <td className="px-3 py-3">{product.brand.name}</td>
                  <td className="px-3 py-3">{formatMoney(product.price)}</td>
                  <td className={`px-3 py-3 ${product.stock === 0 ? "text-sale" : ""}`}>{product.stock}</td>
                  <td className="px-3 py-3">{product.status}</td>
                  <td className="px-3 py-3">{formatDate(product.createdAt)}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-3">
                      <Link href={`/admin/products/${product.id}/edit`} className="text-sky">
                        Edit
                      </Link>
                      <Link href={`/watches/${product.slug}`} className="text-neutral-700">
                        View
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <ConfirmButton label="Delete" message={`Delete ${product.name}?`} className="text-sale" />
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
