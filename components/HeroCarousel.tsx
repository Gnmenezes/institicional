"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type HeroPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export default function HeroCarousel({
  photos,
  className = "",
}: {
  photos: HeroPhoto[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [photos.length]);

  if (photos.length === 0) return null;

  return (
    <div
      className={`group relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl ring-1 ring-white/15 ${className}`}
    >
      {photos.map((photo, i) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          className={`object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 768px) 90vw, 420px"
          priority={i === 0}
        />
      ))}

      {/* Véu escuro na base, pra legenda ficar legível sobre qualquer foto */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/65 to-transparent" />

      <span className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-1.5 text-xs font-semibold text-brand-navy shadow-sm backdrop-blur">
        {photos[index].caption}
      </span>

      {photos.length > 1 && (
        <div className="absolute bottom-6 right-5 flex gap-2">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-brand-orange" : "w-1.5 bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
