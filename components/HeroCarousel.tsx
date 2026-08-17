"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type HeroPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export default function HeroCarousel({ photos }: { photos: HeroPhoto[] }) {
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
    <div className="relative aspect-[3/4] w-full max-w-sm justify-self-center overflow-hidden rounded-2xl shadow-lg md:justify-self-end">
      {photos.map((photo, i) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          className={`object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 768px) 90vw, 400px"
          priority={i === 0}
        />
      ))}

      <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-1.5 text-xs font-semibold text-brand-navy shadow-sm">
        {photos[index].caption}
      </span>

      {photos.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-1.5">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === index ? "bg-brand-orange" : "bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
