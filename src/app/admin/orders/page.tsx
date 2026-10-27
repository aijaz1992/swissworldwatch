import { formatDate, formatMoney } from "@/lib/format";
import { paymentMethodLabel } from "@/lib/payment";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { address: true, items: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="mt-4 overflow-x-auto bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-3 py-3 font-medium">Order</th>
              <th className="px-3 py-3 font-medium">Customer</th>
              <th className="px-3 py-3 font-medium">Total</th>
              <th className="px-3 py-3 font-medium">Payment</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-neutral-500">
                  No orders yet. Checkout will create them here.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-neutral-100">
                <td className="px-3 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-sky">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-3 py-3">
                  <p>{order.address?.fullName ?? order.email}</p>
                  <p className="text-xs text-neutral-500">{order.email}</p>
                </td>
                <td className="px-3 py-3">{formatMoney(order.total)}</td>
                <td className="px-3 py-3">
                  {paymentMethodLabel(order.paymentMethod)}
                  {order.paymentMethod === "UPI" && (
                    <p className={`text-xs ${order.paymentReference ? "text-neutral-500" : "text-sale"}`}>
                      {order.paymentReference ? `UTR ${order.paymentReference}` : "UTR pending"}
                    </p>
                  )}
                </td>
                <td className="px-3 py-3">{order.status}</td>
                <td className="px-3 py-3">{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
