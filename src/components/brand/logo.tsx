import Image from "next/image";

// Transparent gold artwork derived from the master logo in /public/brand/logo-original.png.
// logo-horizontal.png is 765×250.
const HORIZONTAL = { src: "/brand/logo-horizontal.png", width: 765, height: 250 };

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
