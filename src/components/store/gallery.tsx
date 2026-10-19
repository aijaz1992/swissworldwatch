"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, name }: { images: { id: string; url: string; alt: string }[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) {
    return <div className="grid aspect-square place-items-center bg-neutral-100 text-neutral-400">No image</div>;
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image src={current.url} alt={current.alt || name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden bg-neutral-100 ${index === active ? "ring-2 ring-sky" : "ring-1 ring-neutral-200"}`}
            >
              <Image src={image.url} alt="" fill sizes="72px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
