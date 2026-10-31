import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-sm text-neutral-600">That watch or page is not in the catalog.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="btn-sky">
          Go to homepage
        </Link>
        <Link href="/watches" className="btn-outline">
          Browse watches
        </Link>
      </div>
    </div>
  );
}
