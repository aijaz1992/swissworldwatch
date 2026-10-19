import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Customers</h1>
      <p className="mt-2 text-sm text-neutral-600">Accounts are created at registration. Roles are stored on the user record and checked on the server.</p>
      <div className="mt-4 overflow-x-auto bg-white shadow-sm">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-3 py-3 font-medium">Name</th>
              <th className="px-3 py-3 font-medium">Email</th>
              <th className="px-3 py-3 font-medium">Role</th>
              <th className="px-3 py-3 font-medium">Orders</th>
              <th className="px-3 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-neutral-100">
                <td className="px-3 py-3">{customer.name}</td>
                <td className="px-3 py-3">{customer.email}</td>
                <td className="px-3 py-3">{customer.role}</td>
                <td className="px-3 py-3">{customer._count.orders}</td>
                <td className="px-3 py-3">{formatDate(customer.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
