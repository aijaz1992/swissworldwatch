import { UpiPaymentPanel } from "@/components/store/upi-payment";
import { UpiReferenceForm } from "@/components/store/upi-reference-form";
import { formatMoney } from "@/lib/format";
import { paymentMethodLabel } from "@/lib/payment";
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
  const awaitingUpi = order.paymentMethod === "UPI" && order.status === "PENDING";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-sky">{awaitingUpi ? "Order placed · Payment pending" : "Order placed"}</p>
      <h1 className="mt-2 text-3xl font-bold">{order.orderNumber}</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-600">
        We sent the confirmation details to {order.email}. Payment method: {paymentMethodLabel(order.paymentMethod)}.
      </p>
      {awaitingUpi && (
        <section className="mt-6" aria-labelledby="upi-heading">
          <h2 id="upi-heading" className="text-lg font-semibold">
            {order.paymentReference ? "Payment submitted — verification in progress" : "Complete your payment via UPI"}
          </h2>
          <p className="mb-3 mt-1 text-sm leading-6 text-neutral-600">
            {order.paymentReference
              ? `We have your UTR ${order.paymentReference}. Your order is confirmed and dispatched once the payment is verified. Entered it wrong? Update it below.`
              : "Scan the QR with any UPI app, pay the exact amount, then confirm with the UTR / transaction ID so we can verify and dispatch your order."}
          </p>
          <UpiPaymentPanel amount={order.total} orderNumber={order.orderNumber}>
            <UpiReferenceForm orderNumber={order.orderNumber} defaultValue={order.paymentReference} />
          </UpiPaymentPanel>
        </section>
      )}
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
