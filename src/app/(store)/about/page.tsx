import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About us",
  description: "Swiss World Watch is a Mumbai studio catalog for automatic and quartz watches, with insured shipping across India.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky">Swiss World Watch</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">About us</h1>
      <div className="mt-8 space-y-5 text-lg leading-8 text-neutral-700">
        <p>
          Swiss World Watch is a catalog-first store based in Mumbai. Every watch on the site is a real product record — name, price, stock, movement, and photographs — so what you browse is what can be ordered.
        </p>
        <p>
          We keep the range tight: steel sports watches, chronographs, dress pieces, and smaller quartz cases. Specifications sit on the product page. Prepaid orders take a store discount. Cash on delivery is available across India.
        </p>
        <p>
          Questions go to WhatsApp or the showroom desk. If a parcel is wrong or damaged, report it within 48 hours and we sort the return.
        </p>
      </div>
      <Link href="/watches" className="btn-sky mt-10">
        Browse watches
      </Link>
    </div>
  );
}
