import Image from "next/image";
import Link from "next/link";

type MarqueeBrand = {
  id: string | number;
  slug: string;
  name: string;
  imageUrl: string | null;
};

// Minimum number of tiles per loop segment so one segment is always wider
// than the widest container (1240px / ~200px tiles). This keeps the loop
// seamless even when only a few brands are featured.
const MIN_TILES_PER_SEGMENT = 10;
const SECONDS_PER_TILE = 3.5;

export function BrandMarquee({ brands }: { brands: MarqueeBrand[] }) {
  if (brands.length === 0) return null;

  const repeats = Math.max(1, Math.ceil(MIN_TILES_PER_SEGMENT / brands.length));
  const segment = Array.from({ length: repeats }, (_, r) => brands.map((brand) => ({ brand, copy: r }))).flat();
  const duration = `${segment.length * SECONDS_PER_TILE}s`;

  const renderSegment = (segmentIndex: number) => (
    <ul className="marquee-segment" aria-hidden={segmentIndex > 0 ? true : undefined}>
      {segment.map(({ brand, copy }) => {
        const isDuplicate = segmentIndex > 0 || copy > 0;
        return (
          <li key={`${segmentIndex}-${copy}-${brand.id}`} className="marquee-item" aria-hidden={isDuplicate && segmentIndex === 0 ? true : undefined}>
            <Link
              href={`/watches/${brand.slug}`}
              tabIndex={isDuplicate ? -1 : undefined}
              className="group relative block aspect-square w-36 overflow-hidden bg-neutral-200 sm:w-44 lg:w-[196px]"
            >
              {brand.imageUrl && (
                <Image
                  src={brand.imageUrl}
                  alt=""
                  fill
                  sizes="196px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              )}
              <span className="absolute inset-x-0 bottom-0 bg-ink/80 px-3 py-3 text-center text-base font-medium text-white">
                {brand.name}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="marquee" aria-label="Featured brands" role="region">
      <div className="marquee-track" style={{ "--marquee-duration": duration } as React.CSSProperties}>
        {renderSegment(0)}
        {renderSegment(1)}
      </div>
    </div>
  );
}
