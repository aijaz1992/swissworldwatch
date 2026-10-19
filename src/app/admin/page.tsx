import { formatDate, formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminHomePage() {
  const [products, orders, customers, revenue, lowStock, recent] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.product.findMany({
      where: { stock: { lte: 3 }, status: "ACTIVE" },
      orderBy: { stock: "asc" },
      take: 5,
      include: { brand: true },
    }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/admin/products/new" className="btn-sky">
          Add watch
        </Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Products" value={String(products)} />
        <Stat label="Orders" value={String(orders)} />
        <Stat label="Customers" value={String(customers)} />
        <Stat label="Revenue" value={formatMoney(revenue._sum.total ?? 0)} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Low stock</h2>
          {lowStock.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">No active watches are at 3 or below.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {lowStock.map((product) => (
                <li key={product.id} className="flex justify-between gap-3">
                  <Link href={`/admin/products/${product.id}/edit`} className="hover:text-sky">
                    {product.name}
                  </Link>
                  <span>{product.stock}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Recent orders</h2>
          {recent.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">No orders yet.</p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm">
              {recent.map((order) => (
                <li key={order.id}>
                  <Link href={`/admin/orders/${order.id}`} className="font-medium hover:text-sky">
                    {order.orderNumber}
                  </Link>
                  <p className="text-neutral-500">
                    {formatDate(order.createdAt)} · {formatMoney(order.total)} · {order.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-4 border-sky bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
