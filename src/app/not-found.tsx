import { BrandLogo } from "@/components/brand/logo";
import Link from "next/link";

// Shown for URLs outside the store routes (e.g. /some-old-link), which render without the store header.
export default function NotFound() {
  return (
    <main id="content" className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-16 text-center">
      <Link href="/" aria-label="Swiss World Watch home" className="inline-block rounded bg-ink px-5 py-3">
        <BrandLogo preload className="w-[170px]" />
      </Link>
      <h1 className="mt-10 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 max-w-md text-base text-neutral-600">
        That watch or page is not in the catalog. It may have moved or the link may be mistyped.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-sky">
          Go to homepage
        </Link>
        <Link href="/watches" className="btn-outline">
          Browse watches
        </Link>
      </div>
    </main>
  );
}
