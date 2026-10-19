"use client";

export function HeroVideo({ poster }: { poster: string }) {
  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      aria-hidden
    >
      <source src="/hero/watchvideo.mp4" type="video/mp4" />
    </video>
  );
}
