import { updateOrderStatus } from "@/actions/admin";
import { formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, address: true, user: true },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/orders" className="text-sm text-sky">
        Back to orders
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{order.orderNumber}</h1>
      <p className="mt-1 text-sm text-neutral-500">{order.email}</p>
      <form action={updateOrderStatus} className="mt-4 flex items-center gap-2">
        <input type="hidden" name="id" value={order.id} />
        <label className="text-sm" htmlFor="status">
          Status
        </label>
        <select id="status" name="status" defaultValue={order.status} className="input max-w-xs">
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button className="btn-sky">Update</button>
      </form>
      <ul className="mt-6 divide-y divide-neutral-200 bg-white shadow-sm">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 px-4 py-3 text-sm">
            <span>
              {item.name}
              <span className="block text-xs text-neutral-500">{item.sku}</span>
            </span>
            <span>
              {item.quantity} × {formatMoney(item.price)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-right text-sm">
        Subtotal {formatMoney(order.subtotal)} · Discount {formatMoney(order.discount)} · Total {formatMoney(order.total)}
      </p>
      {order.address && (
        <p className="mt-4 text-sm leading-6 text-neutral-700">
          {order.address.fullName}
          <br />
          {order.address.phone}
          <br />
          {order.address.line1}
          {order.address.line2 ? `, ${order.address.line2}` : ""}
          <br />
          {order.address.city}, {order.address.state} {order.address.postalCode}
        </p>
      )}
    </div>
  );
}
