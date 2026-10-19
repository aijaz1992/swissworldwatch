import { formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getCurrency } from "@/lib/settings";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = { title: "Order confirmed" };

export default async function SuccessPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const [order, currency] = await Promise.all([
    prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, address: true },
    }),
    getCurrency(),
  ]);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-sky">Order placed</p>
      <h1 className="mt-2 text-3xl font-bold">{order.orderNumber}</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-600">
        We sent the confirmation details to {order.email}. Payment method: {order.paymentMethod === "PREPAID" ? "Prepaid" : "Cash on delivery"}.
      </p>
      <ul className="mt-6 divide-y divide-neutral-200 border border-neutral-200">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 px-4 py-3 text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatMoney(item.price * item.quantity, currency)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-right text-lg font-semibold">Total {formatMoney(order.total, currency)}</p>
      {order.address && (
        <p className="mt-4 text-sm leading-6 text-neutral-600">
          Delivering to {order.address.fullName}, {order.address.line1}, {order.address.city} {order.address.postalCode}
        </p>
      )}
      <Link href="/watches" className="btn-sky mt-6">
        Continue shopping
      </Link>
    </div>
  );
}
