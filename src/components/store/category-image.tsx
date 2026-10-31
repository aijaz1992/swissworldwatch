import Image from "next/image";

/** Category artwork with a branded fallback when no image is set. */
export function CategoryImage({ src, name, sizes }: { src: string | null; name: string; sizes: string }) {
  if (!src) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-ink to-[#1b2a3d]">
        <span className="font-serif text-4xl text-[#d4b06a]/80" aria-hidden>
          {name.trim().charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }
  // Same-origin uploads (/media/...) are optimized; external links are shown as-is so any host works.
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      unoptimized={!src.startsWith("/")}
      className="object-cover transition duration-500 group-hover:scale-105"
    />
  );
}
