import Image from "next/image";

// Transparent gold artwork derived from the master logo in /public/brand/logo-original.png.
// logo-horizontal.png is 765×250; logo-emblem.png is 247×247.
const HORIZONTAL = { src: "/brand/logo-horizontal.png", width: 765, height: 250 };
const EMBLEM = { src: "/brand/logo-emblem.png", width: 247, height: 247 };

export function BrandLogo({ className, preload = false }: { className?: string; preload?: boolean }) {
  return (
    <Image
      src={HORIZONTAL.src}
      width={HORIZONTAL.width}
      height={HORIZONTAL.height}
      alt="Swiss World Watch"
      preload={preload}
      sizes="(max-width: 640px) 150px, 200px"
      className={`h-auto ${className ?? ""}`}
    />
  );
}

export function BrandEmblem({ className }: { className?: string }) {
  return (
    <Image
      src={EMBLEM.src}
      width={EMBLEM.width}
      height={EMBLEM.height}
      alt=""
      aria-hidden
      sizes="64px"
      className={className}
    />
  );
}
