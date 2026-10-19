import { logoutAction } from "@/actions/store";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Hello, {user.name}</h1>
      <p className="mt-2 text-sm text-neutral-600">{user.email}</p>
      <div className="mt-4 flex gap-3">
        {user.role === "ADMIN" && (
          <Link href="/admin" className="btn-sky">
            Admin dashboard
          </Link>
        )}
        <form action={logoutAction}>
          <button className="border border-neutral-300 px-4 py-2 text-sm">Logout</button>
        </form>
      </div>
      <h2 className="mt-10 text-xl font-semibold">Orders</h2>
      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-600">
          No orders yet. <Link href="/watches" className="text-sky">Browse watches</Link>
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-neutral-200 border border-neutral-200">
          {orders.map((order) => (
            <li key={order.id} className="px-4 py-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{order.orderNumber}</p>
                <p>{formatMoney(order.total)}</p>
              </div>
              <p className="mt-1 text-neutral-500">
                {formatDate(order.createdAt)} · {order.status} · {order.paymentMethod}
              </p>
              <p className="mt-1 text-neutral-600">{order.items.map((item) => item.name).join(", ")}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
