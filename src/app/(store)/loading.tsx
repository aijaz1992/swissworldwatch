export default function Loading() {
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-16">
      <div className="h-8 w-48 animate-pulse bg-neutral-200" />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="aspect-square animate-pulse bg-neutral-100" />
        ))}
      </div>
    </div>
  );
}
