import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-sm text-neutral-600">That watch or page is not in the catalog.</p>
      <Link href="/watches" className="btn-sky mt-6">
        Browse watches
      </Link>
    </div>
  );
}
