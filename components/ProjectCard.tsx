import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/data";

type ProjectCardProps = {
  slug: string;
  title: string;
  city: string;
  state: string;
  category: string;
  powerKwp: number | null;
  photoUrl?: string | null;
};

export default function ProjectCard({
  slug,
  title,
  city,
  state,
  category,
  powerKwp,
  photoUrl,
}: ProjectCardProps) {
  return (
    <Link
      href={`/portfolio/${slug}`}
      className="group block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-navy-light">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-navy/30">
            <svg viewBox="0 0 48 48" className="h-16 w-16" fill="currentColor" aria-hidden="true">
              <path d="M24 4 6 13v9c0 10.5 7.2 19.9 18 22 10.8-2.1 18-11.5 18-22v-9L24 4Zm0 4.5 14 6.5v5.9L24 15.9 10 20.9V15l14-6.5Z" />
            </svg>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-navy shadow-sm">
          {CATEGORY_LABELS[category] ?? category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-brand-navy">{title}</h3>
        <p className="mt-1 text-sm text-brand-navy/60">
          {city} — {state}
          {powerKwp ? ` · ${powerKwp} kWp` : ""}
        </p>
      </div>
    </Link>
  );
}
