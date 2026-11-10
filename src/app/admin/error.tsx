"use client";

import Link from "next/link";
import { useEffect } from "react";

// Keeps admin failures inside the admin shell (instead of the full-page "Something went wrong")
// and shows a reference code that matches the Vercel log entry.
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg bg-white p-6 text-center shadow-sm">
      <h1 className="text-xl font-bold">This admin page could not load</h1>
      <p className="mt-3 text-sm text-neutral-600">
        Please try again, or go back to the product list.
      </p>
      {error.digest && <p className="mt-2 text-xs text-neutral-400">Reference: {error.digest}</p>}
      <div className="mt-5 flex justify-center gap-3">
        <button type="button" onClick={reset} className="btn-sky">
          Try again
        </button>
        <Link href="/admin/products" className="border border-neutral-300 px-4 py-2 text-sm">
          Products
        </Link>
      </div>
    </div>
  );
}
