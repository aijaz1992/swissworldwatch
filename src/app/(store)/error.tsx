"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-sm text-neutral-600">The page could not be loaded. Try again in a moment.</p>
      <button onClick={reset} className="btn-sky mt-6">
        Try again
      </button>
    </div>
  );
}
