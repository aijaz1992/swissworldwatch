"use client";

import { logoutAction } from "@/actions/store";
import { BrandLogo } from "@/components/brand/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({ children, name }: { children: React.ReactNode; name: string }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-neutral-100 md:grid md:grid-cols-[230px_1fr]">
      <aside className="bg-neutral-950 text-white">
        <div className="px-5 py-5">
          <Link href="/admin" aria-label="Swiss World Watch admin dashboard" className="inline-block">
            <BrandLogo className="w-[160px]" />
          </Link>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d4b06a]">Admin</p>
          <p className="mt-3 text-xs text-neutral-400">{name}</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-3 pb-3 md:block md:space-y-1 md:px-3" aria-label="Admin">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block whitespace-nowrap rounded-sm px-3 py-2 text-sm ${active ? "bg-sky text-white" : "text-neutral-300 hover:bg-white/10"}`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/" className="block whitespace-nowrap rounded-sm px-3 py-2 text-sm text-neutral-300 hover:bg-white/10">
            View store
          </Link>
          <form action={logoutAction}>
            <button className="w-full rounded-sm px-3 py-2 text-left text-sm text-neutral-300 hover:bg-white/10">Logout</button>
          </form>
        </nav>
      </aside>
      <div className="px-4 py-6 sm:px-8">{children}</div>
    </div>
  );
}
